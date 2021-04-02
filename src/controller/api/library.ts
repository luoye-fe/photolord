import { Controller, Get, Post, Provide, Inject, Options } from '@midwayjs/decorator';
import { Context } from 'egg';
import * as fs from 'fs';
import * as pathModule from 'path';

import ApiLibraryService from '@/service/api/library';
import { publishLibraryUpdateMessage } from '@/ipc/index';
import { IResponse } from '@/typings';
import { isSubDir } from '@/utils/index';

@Provide()
@Controller('/api/library', {
  middleware: [
    'userMiddleware',
  ],
})
export class ApiLibraryController {

  @Inject()
  libraryService: ApiLibraryService;

  @Get('/list')
  async list() {
    return 'auth';
  }

  @Get('/detail')
  async detail(ctx: Context): Promise<IResponse> {
    const { id } = ctx.query;

    if (!id) return ctx.fail(400, ctx.errorCode.Params_Error);

    const result = await this.libraryService.query({
      id: Number(id),
    });

    if (!result) return ctx.fail(400, 'library not found');

    return ctx.success(this.formatLibraryResult(result));
  }

  @Options('/create')
  @Post('/create')
  async crate(ctx: Context): Promise<IResponse> {
    const { path, autoAnalyse = true, comment = '' } = ctx.request.body;
    if (!path) return ctx.fail(400, ctx.errorCode.Params_Error);

    const pathIsExists = fs.existsSync(path);
    if (!pathIsExists) return ctx.fail(400, 'path not exists');
    if (!pathModule.isAbsolute(path)) return ctx.fail(400, 'library path must absolute path');

    let result = null;

    const allLibraries = await this.libraryService.queryAll();

    for(let i = 0; i < allLibraries.length; i++) {
      const item = allLibraries[i];

      if (path === item.path && item.delete_flag === 0) return ctx.fail(400, 'library has existed');

      if (isSubDir(path, item.path) && item.delete_flag === 0) return ctx.fail(400, 'this library is sub dir belongs to some library');

      if (isSubDir(item.path, path) && item.delete_flag === 0) return ctx.fail(400, 'this library is parent dir belongs to some library');

      if (item.delete_flag === 1) {
        result = await this.libraryService.update(item.id, {
          comment,
          auto_analyse: autoAnalyse ? 1 : 0,
          analyse_ing: 0,
          delete_flag: 0,
        });

        await publishLibraryUpdateMessage();
        ctx.success(result);
        return;
      }
    }

    result = await this.libraryService.create({
      path,
      auto_analyse: autoAnalyse ? 1 : 0,
      comment,
    });

    await publishLibraryUpdateMessage();
    ctx.success(result);
  }

  @Post('/update')
  async update() {
    return 'auth';
  }

  @Post('/delete')
  async delete() {
    return 'auth';
  }

  private formatLibraryResult(source) {
    return source;
  }
}
