import * as path from 'path';
import sharp from 'sharp';
import { Controller, Get, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

import { LibraryModel } from '@/entity/library';
import { ResourceModel } from '@/entity/resource';
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

  @Get('/list')
  async list(ctx: Context) {
    const { page = '1', size = '10' } = ctx.query;

    const nPage = Number(page);
    const nSize = Number(size);

    const result = await this.resourceModel.find({
      take: nSize,
      skip: (nPage - 1) * nSize,
      order: {
        gmt_create: 'DESC',
      },
    });

    const count = await this.resourceModel.count();

    ctx.success({
      page: nPage,
      size: nSize,
      count,
      hasMore: count > page * size,
      list: result,
    });
  }

  @Get('/transcode')
  async transcode(ctx: Context) {
    const { md5, width, height } = ctx.query;
    if (!md5) return ctx.fail(400, ctx.errorCode.Params_Error);

    const { path: filePath, library_id: libraryId } = await this.resourceModel.findOne({ md5 });

    const { path: libraryPath } = await this.libraryModel.findOne({
      id: libraryId,
    });

    const fileAbsolutePath = path.join(libraryPath, filePath);
    const resizeOptions: sharp.ResizeOptions = {};

    if (width && !height) {
      resizeOptions.width = Number(width);
      resizeOptions.fit = 'contain';
    }

    if (!width && height) {
      resizeOptions.height = Number(height);
      resizeOptions.fit = 'contain';
    }

    if (width && height) {
      resizeOptions.width = Number(width);
      resizeOptions.height = Number(height);
    }

    if (!width && !height) {
      resizeOptions.width = 300;
      resizeOptions.fit = 'contain';
    }

    ctx.response.type = 'image/jpeg';
    ctx.body = await sharp(fileAbsolutePath)
      .resize(resizeOptions)
      .toFormat('jpeg', { force: true })
      .toBuffer();
  }
}
