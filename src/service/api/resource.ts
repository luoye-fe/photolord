import * as path from 'path';
import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

import { LibraryModel } from '@/entity/library';
import { ResourceModel } from '@/entity/resource';
import { ResourceExifModel } from '@/entity/resource_exif';
import { IPlainObject, IResourceActionResult } from '@/typings';

@Provide()
export default class ApiResourceService {
  @InjectEntityModel(LibraryModel)
  private libraryModel: Repository<LibraryModel>;

  @InjectEntityModel(ResourceModel)
  private resourceModel: Repository<ResourceModel>;

  @InjectEntityModel(ResourceExifModel)
  private resourceExifModel: Repository<ResourceExifModel>;

  private processResourceMap = new Map<number, IResourceActionResult[]>();
  private processIngMap = new Map<number, boolean>();

  private queueHandleResource(id: number) {
    if (this.processIngMap.get(id)) return;
    this.processIngMap.set(id, true);

    this.libraryModel.update(id, {
      analyse_ing: 1,
    });

    const handOneResource = async () => {
      const processResourceList = this.processResourceMap.get(id);
      const target = processResourceList[0];
      if (!target) {
        this.processIngMap.set(id, false);

        this.libraryModel.update(id, {
          analyse_ing: 0,
        });
        return;
      }

      const { action, libraryId, resourceInfo, resourcePath } = target;

      const { path: libraryPath } = await this.libraryModel.findOne({
        id: libraryId,
      });

      const resourceRelativePath = path.relative(libraryPath, resourcePath);

      if (action === 'add') {
        await this.resourceModel.save({
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
        });

        await this.insertResourceExif(resourceInfo.md5, resourceInfo.exif);
      }

      if (action === 'unlink') {
        await this.removeLibrary(libraryId, resourceRelativePath);
      }

      processResourceList.shift();
      handOneResource.call(this);
    };

    handOneResource();
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
    } catch(e) {} // eat all conflict error
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
    const currentLibraryList = this.processResourceMap.get(libraryId);
    if (!currentLibraryList) this.processResourceMap.set(libraryId, []);

    this.processResourceMap.get(libraryId).push(resourceActionInfo);
    this.queueHandleResource(libraryId);
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
  public formatResourceInfo(info: ResourceModel) {
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
