import { EggPlugin } from 'egg';

export default {
  logrotator: false,
  static: true,
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
} as EggPlugin;
