import { Controller, Get, Post, Provide, Options } from '@midwayjs/decorator';
import { Context } from 'egg';
import * as fs from 'fs';
import * as pathModule from 'path';

import { publishLibraryUpdateMessage } from '@/ipc/index';
import { IResponse } from '@/typings';
import { isSubDir } from '@/utils/index';
import { LibraryModel } from '@/entity/library';
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/orm';

@Provide()
@Controller('/api/library', {
  middleware: [
    'userMiddleware',
  ],
})
export class ApiLibraryController {
  @InjectEntityModel(LibraryModel)
  private libraryModel: Repository<LibraryModel>;

  @Get('/list')
  async list(ctx: Context) {
    const { page = '1', size = '10' } = ctx.query;

    const result = await this.libraryModel.find({
      take: Number(size),
      skip: (Number(page) - 1) * Number(size),
      order: {
        gmt_create: 'DESC',
      },
    });

    return ctx.success({
      page,
      size,
      list: result.map(this.formatLibraryResult),
    });
  }

  @Get('/detail')
  async detail(ctx: Context): Promise<IResponse> {
    const { id } = ctx.query;
    if (!id) return ctx.fail(400, ctx.errorCode.Params_Error);

    const result = await this.libraryModel.findOne({
      id: Number(id),
    });

    if (!result) return ctx.fail(400, 'library not found');

    return ctx.success(this.formatLibraryResult(result));
  }

  @Options('/create')
  @Post('/create')
  async crate(ctx: Context): Promise<IResponse> {
    const { path, comment = '' } = ctx.request.body;
    if (!path) return ctx.fail(400, ctx.errorCode.Params_Error);

    const pathIsExists = fs.existsSync(path);
    if (!pathIsExists) return ctx.fail(400, 'path not exists');
    if (!pathModule.isAbsolute(path)) return ctx.fail(400, 'library path must absolute path');

    const allLibraries = await this.libraryModel.find();

    for (let i = 0; i < allLibraries.length; i++) {
      const item = allLibraries[i];

      if (path === item.path) return ctx.fail(400, 'library has existed');

      if (isSubDir(path, item.path)) return ctx.fail(400, 'this library is sub dir belongs to some library');

      if (isSubDir(item.path, path)) return ctx.fail(400, 'this library is parent dir belongs to some library');
    }

    const result = await this.libraryModel.save({
      path,
      comment,
    });

    await publishLibraryUpdateMessage();
    ctx.success(result);
  }

  @Post('/delete')
  async delete(ctx: Context) {
    const { id } = ctx.request.body;
    if (!id) return ctx.fail(400, ctx.errorCode.Params_Error);

    await this.libraryModel.delete({
      id: Number(id),
    });

    ctx.success({
      id,
    });
  }

  @Post('/scan')
  async scan(ctx: Context) {
    const { id } = ctx.request.body;
    if (!id) return ctx.fail(400, ctx.errorCode.Params_Error);

    const result = await this.libraryModel.findOne({
      id: Number(id),
    });

    if (result.analyse_ing === 1) return ctx.success({
      process: true,
      message: 'analyze ing',
    });

    // scan message
    // xxxx

    // update status
    await this.libraryModel.update(id, {
      analyse_ing: 1,
    });

    ctx.success({
      process: true,
      message: 'analyze ing',
    });

    // begin analyze library

  }

  private formatLibraryResult(source: LibraryModel) {
    return {
      id: source.id,
      path: source.path,
      comment: source.comment,
      analyzeIng: source.analyse_ing,
    };
  }
}
