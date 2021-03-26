import { Controller, Get, Post, Provide, Inject } from '@midwayjs/decorator';
import { Context } from 'egg';

import ApiLibraryService from '@/service/api/library';
import { IResponse } from '@/typings';

@Provide()
@Controller('/api/library')
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

  @Post('/create')
  async crate() {
    return 'auth';
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
