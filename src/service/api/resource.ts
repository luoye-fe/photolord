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

  private processFileList: IResourceActionResult[] = [];
  private processIng = false;

  private queueHandleFile() {
    if (this.processIng) return;
    this.processIng = true;

    const handOneFile = async () => {
      const target = this.processFileList[0];
      if (!target) {
        this.processIng = false;
        return;
      }

      const { action, libraryId, fileInfo, filePath } = target;

      const { path: libraryPath } = await this.libraryModel.findOne({
        id: libraryId,
      });

      const resourceRelativePath = path.relative(libraryPath, filePath);

      if (action === 'add') {
        await this.resourceModel.save({
          md5: fileInfo.md5,
          path: resourceRelativePath,
          library_id: libraryId,
          format: fileInfo.format,
          name: fileInfo.name,
          size: fileInfo.size,
          width: fileInfo.width,
          height: fileInfo.height,
          create_date: fileInfo.createDate,
          modify_date: fileInfo.modifyDate,
          gmt_create: new Date(),
          gmt_modified: new Date(),
        });

        await this.insertExif(fileInfo.md5, fileInfo.exif);
      }

      if (action === 'unlink') {
        await this.remove(libraryId, resourceRelativePath);
      }

      this.processFileList.shift();
      handOneFile.call(this);
    };

    handOneFile();
  }

  public async insertExif(md5: string, exif: IPlainObject) {
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

  public async remove(libraryId: number, path: string) {
    const resourceDetail = await this.resourceModel.findOne({
      library_id: libraryId,
      path,
    });

    if (resourceDetail) {
      const sameMd5ResourceCount = await this.resourceModel.count({
        md5: resourceDetail.md5,
      });
  
      // same md5 resource only one, remove all resource exif
      if (sameMd5ResourceCount === 1) await this.resourceExifModel.delete({ md5: resourceDetail.md5 });
    }

    return await this.resourceModel.delete({
      library_id: libraryId,
      path,
    });
  }

  // queue handle all file action
  public handle(resourceActionInfo: IResourceActionResult) {
    this.processFileList.push(resourceActionInfo);
    this.queueHandleFile();
  }

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
