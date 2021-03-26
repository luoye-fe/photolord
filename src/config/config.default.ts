import * as path from 'path';
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { Sequelize } from 'sequelize-typescript';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo): DefaultConfig => {
  const config = {} as DefaultConfig;

  config.keys = appInfo.name + '_1616715716889_964';

  config.middleware = [];
  
  config.midwayFeature = {
    replaceEggLogger: true,      
  };

  config.sequelize = {
    dialect: 'sqlite',
    storage: path.join(appInfo.baseDir, '../db/database.sqlite'),
    Sequelize,
  };

  return config;
};
