import { Controller, Get, Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

import { LibraryModel } from '@/entity/library';
import { ResourceModel } from '@/entity/resource';
import ResourceService from '@/service/api/resource';
import { Context } from 'node:vm';
import { IResourceAnalyseResult, IResourceInfo } from '@/typings';

type TreeResourceItem = {
  type: 'resource';
  resourceInfo: IResourceInfo;
};

type TreeDirectoryItem = {
  type: 'directory';
  dirName: string;
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

  @Inject()
  resourceService: ResourceService;

  @Get('/tree')
  async list(ctx: Context) {
    const { page = '1', size = '10', id, path: relativePath = '' } = ctx.query;
    if (!id || !relativePath || (relativePath !== '/' && !/^\/.*\/$/.test(relativePath))) return ctx.fail(400, ctx.errorCode.Params_Error);

    const nPage = Number(page);
    const nSize = Number(size);

    const [allResource, allDirectory] = await Promise.all([this.findAllResourceByPath(relativePath), this.findAllDirectoryByPath(relativePath)]);
    const formattedResourceList = this.formatResourceList(allResource);
    const formattedDirectoryList = this.formatDirectoryList(allDirectory);
    const concatList: TreeItem[] = [...formattedDirectoryList, ...formattedResourceList];

    ctx.success({
      page: nPage,
      size: nSize,
      list: concatList.slice(0, page * size),
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

  // find all children resource by relative path
  private async findAllResourceByPath(relativePath: string) {
    if (relativePath === '/') {
      return await this.resourceModel
        .createQueryBuilder()
        .select('*')
        .where('path NOT LIKE :path', { path: '%/%' })
        .orderBy('create_date', 'DESC')
        .execute();
    } else {
      relativePath = relativePath.replace(/^\//, '');
      return await this.resourceModel.createQueryBuilder()
        .select('*')
        .where('path LIKE :pathOne AND path NOT LIKE :pathTwo', { pathOne: `${relativePath}%`, pathTwo: `${relativePath}%/%` })
        .orderBy('create_date', 'DESC')
        .execute();
    }
  }

  // find all children directory by relative path
  private async findAllDirectoryByPath(relativePath: string) {
    if (relativePath === '/') {
      return await this.resourceModel
        .createQueryBuilder()
        .select('*')
        .where('path LIKE :pathOne AND path NOT LIKE :pathTwo', { pathOne: '%/%', pathTwo: '%/%/%' })
        .orderBy('path', 'DESC')
        .execute();
    } else {
      relativePath = relativePath.replace(/^\//, '');
      return await this.resourceModel.createQueryBuilder()
        .select('*')
        .where('path LIKE :pathOne AND path NOT LIKE :pathTwo', { pathOne: `${relativePath}%/%`, pathTwo: `${relativePath}%/%/%` })
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
      if (!tempMap[dirName]) tempMap[dirName] = [];
      tempMap[dirName].push(item);
    });

    return Object.keys(tempMap).map(key => {
      const currentDirResourceList = tempMap[key];
      return {
        type: 'directory',
        dirName: key,
        preview: currentDirResourceList.slice(0, 4).map(this.resourceService.formatResourceInfo),
      };
    });
  }
}
