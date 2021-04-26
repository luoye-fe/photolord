import * as path from 'path';
import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

import ResourceQueue from '@/utils/resourceQueue';
import { analyseResource } from '@/utils/resource';
import { LibraryModel } from '@/entity/library';
import { ResourceModel } from '@/entity/resource';
import { ResourceExifModel } from '@/entity/resource_exif';
import { IPlainObject, IResourceActionResult, IResourceInfo } from '@/typings';

@Provide()
export default class ApiResourceService {
  @InjectEntityModel(LibraryModel)
  private libraryModel: Repository<LibraryModel>;

  @InjectEntityModel(ResourceModel)
  private resourceModel: Repository<ResourceModel>;

  @InjectEntityModel(ResourceExifModel)
  private resourceExifModel: Repository<ResourceExifModel>;

  private queueInstance = new ResourceQueue();

  constructor() {
    this.queueInstance.setCallback(this._handleResource.bind(this));

    // queue start
    this.queueInstance.onStart((id) => {
      this.libraryModel.update(id, { analyse_ing: 1 });
    });

    // queue finish
    this.queueInstance.onFinish((id) => {
      this.libraryModel.update(id, { analyse_ing: 0 });
    });
  }

  private async _handleResource(target: IResourceActionResult) {
    const { action, libraryId, resourcePath } = target;

    const { path: libraryPath } = await this.libraryModel.findOne({ id: libraryId });
    const resourceRelativePath = path.relative(libraryPath, resourcePath);

    if (action === 'add') {
      // analyze image resource
      const resourceInfo = await analyseResource(resourcePath);
      if (!resourceInfo) return;

      // update or save
      try {
        await this.resourceExifModel
          .createQueryBuilder()
          .insert()
          .into(ResourceModel)
          .values({
            md5: resourceInfo.md5,
            path: resourceRelativePath,
            library_id: libraryId,
            format: resourceInfo.format,
            name: resourceInfo.name,
            size: resourceInfo.size,
            width: resourceInfo.width,
            height: resourceInfo.height,
            create_date: resourceInfo.createDate,
            modify_date: resourceInfo.modifyDate,
            gmt_create: new Date(),
            gmt_modified: new Date(),
          })
          .execute();
      } catch (e) { } // eat all conflict error

      // insert image exif
      await this.insertResourceExif(resourceInfo.md5, resourceInfo.exif);
    }

    if (action === 'unlink') {
      await this.removeLibrary(libraryId, resourceRelativePath);
    }
  }

  private async insertResourceExif(md5: string, exif: IPlainObject) {
    const exifList = Object.keys(exif).map(key => ({
      md5,
      key,
      value: exif[key],
      gmt_create: new Date(),
      gmt_modified: new Date(),
    }));

    try {
      return await this.resourceExifModel
        .createQueryBuilder()
        .insert()
        .into(ResourceExifModel)
        .values(exifList)
        .execute();
    } catch (e) { } // eat all conflict error
  }

  private async removeLibrary(libraryId: number, path: string) {
    const resourceDetail = await this.resourceModel.findOne({
      library_id: libraryId,
      path,
    });

    if (resourceDetail) {
      const sameMd5ResourceCount = await this.resourceModel.count({
        md5: resourceDetail.md5,
      });

      // same MD5 resource only appear once, delete its exif info
      if (sameMd5ResourceCount === 1) await this.resourceExifModel.delete({ md5: resourceDetail.md5 });
    }

    return await this.resourceModel.delete({
      library_id: libraryId,
      path,
    });
  }

  /**
   * push resource to queue list
   */
  public handleResource(resourceActionInfo: IResourceActionResult) {
    const { libraryId } = resourceActionInfo;
    this.queueInstance.add(libraryId, resourceActionInfo);
    this.queueInstance.run(libraryId);
  }

  /**
   * reset all libraries scan status
   */
  public async resetAllLibraryScanStatus() {
    await this.libraryModel
      .createQueryBuilder()
      .update(LibraryModel)
      .set({ analyse_ing: 0 })
      .where('id LIKE :id', { id: '%' })
      .execute();
  }

  /**
   * format resource info
   */
  public formatResourceInfo(info: ResourceModel): IResourceInfo {
    return {
      id: info.id,
      libraryId: info.library_id,
      createDate: info.create_date,
      modifyDate: info.modify_date,
      format: info.format,
      size: info.size,
      width: info.width,
      height: info.height,
      name: info.name,
      path: info.path,
      md5: info.md5,
    };
  }
}
