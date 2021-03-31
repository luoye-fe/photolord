import { Context } from 'egg';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { Controller, Get, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

import { SettingModel } from '@/entity/setting';
import { DEFAULT_PASSWORD, DEFAULT_USER_NAME } from '@/const/token/index';
import { IPlainObject } from '@/typings';

@Provide()
@Controller('/api/auth')
export class ApiIndexController {

  @InjectEntityModel(SettingModel)
  settingModel: Repository<SettingModel>;

  @Get('/login')
  async home(ctx: Context) {
    const { username, password } = ctx.query;
    if (!username || !password) return ctx.fail(400, ctx.errorCode.Params_Error);

    const [usernameItem, passwordItem, passwordSaltItem] = await this.settingModel.find({
      where: [{
        key: 'username',
      }, {
        key: 'password',
      }, {
        key: 'password_salt',
      }],
    });

    if (usernameItem) {
      // account name not match
      if (usernameItem.value !== username) return ctx.fail(400, 'login fail');

      // account password not match
      const encryptedPassword = this.encryptPassword(password, passwordSaltItem.value);
      if (encryptedPassword !== passwordItem.value) return ctx.fail(400, 'login fail');

      return ctx.success({
        token: this.jwtSign({
          username,
        }, passwordSaltItem.value),
      });
    } else {
      // default account name not match
      if (username !== DEFAULT_USER_NAME) return ctx.fail(400, 'login fail');

      // default account password not match
      if (password !== DEFAULT_PASSWORD) return ctx.fail(400, 'login fail');

      // create default account
      const salt = uuidv4();
      const encryptedPassword = this.encryptPassword(DEFAULT_PASSWORD, salt);

      await this.settingModel.save([
        { key: 'username', value: DEFAULT_USER_NAME },
        { key: 'password', value: encryptedPassword },
        { key: 'password_salt', value: salt },
      ]);

      return ctx.success({
        token: this.jwtSign({
          username,
        }, salt),
      });
    }
  }

  private jwtSign(data: IPlainObject, salt: string,) {
    return jwt.sign({
      username: data.username,
    }, salt, {
      expiresIn: '7d',
    });
  }

  private encryptPassword(originPassword: string, salt: string) {
    const hash = crypto.createHash('sha256');
    hash.update(originPassword);
    hash.update(salt);

    return hash.digest('hex');
  }
}
