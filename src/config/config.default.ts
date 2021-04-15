import * as path from 'path';
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo): DefaultConfig => {
  const config = {} as DefaultConfig;

  config.keys = appInfo.name + '_1616715716889_964';

  config.middleware = [];
  
  config.midwayFeature = {
    replaceEggLogger: true,      
  };

  config.orm = {
    type: 'sqlite',
    database: path.join(appInfo.baseDir, '../db/database.sqlite'),
    synchronize: true,
    logging: true,
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  };

  config.security = {
    domainWhiteList: [ 'http://127.0.0.1:7001' ],
    csrf: false,
  };

  return config;
};
