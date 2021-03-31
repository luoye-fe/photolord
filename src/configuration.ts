import { Configuration } from '@midwayjs/decorator';

@Configuration({
  importConfigs: [
    './config/',
  ],
  imports: [
    '@midwayjs/orm',
  ],
})
export class ContainerConfiguration {

}