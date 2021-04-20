import { EggAppConfig, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (): DefaultConfig => {
  const config = {} as DefaultConfig;

  return config;
};
