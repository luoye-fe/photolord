import { Controller, Get, Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

import { LibraryModel } from '@/entity/library';
import { ResourceModel } from '@/entity/resource';
import ResourceService from '@/service/api/resource';
import { Context } from 'node:vm';
import { IResourceAnalyseResult, IResourceInfo } from '@/typings';
import { ResourceExifModel } from '@/entity/resource_exif';

type TreeResourceItem = {
  type: 'resource';
  resourceInfo: IResourceInfo;
};

type TreeDirectoryItem = {
  type: 'directory';
  dirName: string;
  path: string;
  preview: IResourceInfo[];
};

type TreeItem = TreeResourceItem | TreeDirectoryItem;

@Provide()
@Controller('/api/resource', {
  middleware: [
    'userMiddleware',
  ],
})
export class ApiResourceController {
  @InjectEntityModel(LibraryModel)
  libraryModel: Repository<LibraryModel>;

  @InjectEntityModel(ResourceModel)
  resourceModel: Repository<ResourceModel>;

  @InjectEntityModel(ResourceExifModel)
  resourceExifModel: Repository<ResourceExifModel>;

  @Inject()
  resourceService: ResourceService;

  @Get('/tree')
  async list(ctx: Context) {
    const { id, path: relativePath = '' } = ctx.query;
    if (!id || !relativePath || (relativePath !== '/' && !/^\/.*\/$/.test(relativePath))) return ctx.fail(400, ctx.errorCode.Params_Error);

    const [allResource, allDirectory] = await Promise.all([this.findAllResourceByPath(id, relativePath), this.findAllDirectoryByPath(id, relativePath)]);
    const formattedResourceList = this.formatResourceList(allResource);
    const formattedDirectoryList = this.formatDirectoryList(allDirectory);
    const concatList: TreeItem[] = [...formattedDirectoryList, ...formattedResourceList];

    ctx.success({
      list: concatList,
    });
  }

  @Get('/timeline')
  async timeline(ctx: Context) {
    const { page = '1', size = '10' } = ctx.query;

    const nPage = Number(page);
    const nSize = Number(size);

    const result = await this.resourceModel.find({
      take: nSize,
      skip: (nPage - 1) * nSize,
      order: {
        create_date: 'DESC',
      },
    });

    const count = await this.resourceModel.count();

    ctx.success({
      page: nPage,
      size: nSize,
      count,
      hasMore: count > page * size,
      list: result.map(this.resourceService.formatResourceInfo),
    });
  }

  @Get('/detail')
  async detail(ctx: Context) {
    const { md5 } = ctx.query;
    if (!md5) return ctx.fail(400, ctx.errorCode.Params_Error);

    const baseDetail = await this.resourceModel.findOne({ md5 });
    const exifDetail = await this.resourceExifModel.find({ md5 });

    ctx.success({
      baseDetail,
      exifDetail: exifDetail.reduce((s, i) => {
        s[i.key] = i.value;
        return s;
      }, {}),
    });
  }

  // find all children resource by relative path
  private async findAllResourceByPath(libraryId: number, relativePath: string) {
    if (relativePath === '/') {
      return await this.resourceModel
        .createQueryBuilder()
        .select('*')
        .where('library_id = :id AND path NOT LIKE :path', { id: libraryId, path: '%/%' })
        .orderBy('create_date', 'DESC')
        .execute();
    } else {
      relativePath = relativePath.replace(/^\//, '');
      return await this.resourceModel.createQueryBuilder()
        .select('*')
        .where('library_id = :id AND path LIKE :pathOne AND path NOT LIKE :pathTwo', { id: libraryId, pathOne: `${relativePath}%`, pathTwo: `${relativePath}%/%` })
        .orderBy('create_date', 'DESC')
        .execute();
    }
  }

  // find all children directory by relative path
  private async findAllDirectoryByPath(libraryId: number, relativePath: string) {
    if (relativePath === '/') {
      return await this.resourceModel
        .createQueryBuilder()
        .select('*')
        .where('library_id = :id AND path LIKE :pathOne AND path NOT LIKE :pathTwo', { id: libraryId, pathOne: '%/%', pathTwo: '%/%/%' })
        .orderBy('path', 'DESC')
        .execute();
    } else {
      relativePath = relativePath.replace(/^\//, '');
      return await this.resourceModel.createQueryBuilder()
        .select('*')
        .where('library_id = :id AND path LIKE :pathOne AND path NOT LIKE :pathTwo', { id: libraryId, pathOne: `${relativePath}%/%`, pathTwo: `${relativePath}%/%/%` })
        .orderBy('path', 'DESC')
        .execute();
    }
  }

  private formatResourceList(resourceList: ResourceModel[]): TreeResourceItem[] {
    if (!resourceList.length) return [];

    return resourceList.map(item => ({
      type: 'resource',
      resourceInfo: this.resourceService.formatResourceInfo(item),
    }));
  }

  private formatDirectoryList(directoryList: IResourceAnalyseResult[]): TreeDirectoryItem[] {
    if (!directoryList.length) return [];

    const tempMap = {};
    directoryList.forEach(item => {
      const dirAllLayer = item.path.match(/.*?\//g);
      const dirName = dirAllLayer[dirAllLayer.length - 1].replace(/\/$/, '');
      if (!tempMap[dirName]) tempMap[dirName] = { path: dirAllLayer.join(''), list: [] };
      tempMap[dirName].list.push(item);
    });

    return Object.keys(tempMap).map(key => {
      const currentDirResourceList = tempMap[key];
      return {
        type: 'directory',
        dirName: key,
        path: currentDirResourceList.path,
        preview: currentDirResourceList.list.slice(0, 4).map(this.resourceService.formatResourceInfo),
      };
    });
  }
}
