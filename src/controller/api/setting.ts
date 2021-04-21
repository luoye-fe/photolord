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
    const result = await this.settingModel.find();

    const settingDefaultConfig = {
      locale: 'en',
    };

    const response = {};

    result.forEach(item => {
      if (settingDefaultConfig[item.key]) response[item.key] = item.value;
    });

    ctx.success({
      ...settingDefaultConfig,
      ...response,
    });
  }
}
