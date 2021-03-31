import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { InjectEntityModel } from '@midwayjs/orm';
import { Context } from 'egg';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

import ErrorCode from '@/const/error-code/index';
import { SettingModel } from '@/entity/setting';

@Provide()
export class UserMiddleware implements IWebMiddleware {
  @InjectEntityModel(SettingModel)
  settingModel: Repository<SettingModel>;

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      const { token } = ctx.headers as { token: string };
      if (!token) return ctx.fail(403, ErrorCode.Not_Login);

      const salt = await this.settingModel.findOne({
        where: {
          key: 'password_salt',
        },
      });

      try {
        jwt.verify(token, salt.value);
      } catch (e) {
        return ctx.fail(403, ErrorCode.Not_Login);
      }

      await next();
    };
  }
}