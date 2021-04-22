import * as path from 'path';
import sharp from 'sharp';
import { Controller, Get, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

import { LibraryModel } from '@/entity/library';
import { ResourceModel } from '@/entity/resource';
import { Context } from 'node:vm';

@Provide()
@Controller('/api/transcode')
export class ApiTranscodeController {
  @InjectEntityModel(LibraryModel)
  libraryModel: Repository<LibraryModel>;

  @InjectEntityModel(ResourceModel)
  resourceModel: Repository<ResourceModel>;

  @Get('/')
  async transcode(ctx: Context) {
    const { md5, width, height } = ctx.query;
    if (!md5) return ctx.fail(400, ctx.errorCode.Params_Error);

    const { path: resourcePath, library_id: libraryId } = await this.resourceModel.findOne({ md5 });

    const { path: libraryPath } = await this.libraryModel.findOne({
      id: libraryId,
    });

    const resourceAbsolutePath = path.join(libraryPath, resourcePath);
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
    ctx.body = await sharp(resourceAbsolutePath)
      .resize(resizeOptions)
      .toFormat('jpeg', { force: true })
      .toBuffer();
  }
}
