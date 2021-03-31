import { EggPlugin } from 'egg';

export default {
  logrotator: false,
  static: true,
  cors: {
    enable: true,
    package: 'egg-cors',
  },
} as EggPlugin;
