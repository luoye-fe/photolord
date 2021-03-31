import { Controller, Get, Post, Provide, Inject, Options } from '@midwayjs/decorator';
import { Context } from 'egg';
import * as fs from 'fs';

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

    const result = await this.libraryService.query(Number(id));

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

    const libraryIsExists = await this.libraryService.queryByPath(path);
    if (libraryIsExists) return ctx.fail(400, 'library has exits');

    const result = await this.libraryService.create({
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
