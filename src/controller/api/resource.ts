import { Controller, Get, Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

import { LibraryModel } from '@/entity/library';
import { ResourceModel } from '@/entity/resource';
import ResourceService from '@/service/api/resource';
import { Context } from 'node:vm';

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

  @Get('/list')
  async list(ctx: Context) {
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
}
