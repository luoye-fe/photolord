import { Controller, Get, Post, Provide, Inject, Options } from '@midwayjs/decorator';
import { Context } from 'egg';
import * as fs from 'fs';
import * as pathModule from 'path';

import ApiLibraryService from '@/service/api/library';
import { publishLibraryUpdateMessage } from '@/ipc/index';
import { IResponse } from '@/typings';

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

    const existedLibrary = await this.libraryService.query({ path });

    if (existedLibrary) {
      if (existedLibrary.delete_flag === 1) {
        result = await this.libraryService.update(existedLibrary.id, {
          comment,
          auto_analyse: autoAnalyse ? 1 : 0,
          analyse_ing: 0,
          delete_flag: 0,
        });
      } else {
        return ctx.fail(400, 'library has existed');
      }
    } else {
      result = await this.libraryService.create({
        path,
        auto_analyse: autoAnalyse ? 1 : 0,
        comment,
      });
    }

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
