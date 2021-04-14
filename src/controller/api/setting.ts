import { Context } from 'egg';
import { Controller, Get, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

import { SettingModel } from '@/entity/setting';

@Provide()
@Controller('/api/setting', {
  middleware: [
    'userMiddleware',
  ],
})
export class ApiSettingController {

  @InjectEntityModel(SettingModel)
  settingModel: Repository<SettingModel>;

  @Get('/info')
  async list(ctx: Context) {
    ctx.success({});
  }
}
