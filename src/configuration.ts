import { Inject } from '@midwayjs/decorator';
import { Configuration } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';

import ApiResourceService from '@/service/api/resource';
import { IResourceActionResult } from '@/typings';
import { IPC_AGENT_RESOURCE_UPDATE } from '@/ipc/channel';

@Configuration({
  importConfigs: [
    './config/',
  ],
  imports: [
    '@midwayjs/orm',
  ],
})
export class ContainerLifeCycle implements ILifeCycle {
  @Inject()
  resourceService: ApiResourceService;
  
  async onReady() {
    global.eventInstance.on(IPC_AGENT_RESOURCE_UPDATE, (result: IResourceActionResult) => {
      this.resourceService.handle(result);
    });
  }
}
