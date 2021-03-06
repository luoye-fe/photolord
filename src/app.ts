import { Application } from 'egg';
import { IBoot } from 'midway';

import { publishLibraryUpdateMessage } from '@/ipc/index';
import { IPC_AGENT_RESOURCE_UPDATE } from '@/ipc/channel';
import { IResourceActionResult } from '@/typings';
import Event from 'events';
import EventEmitter from 'node:events';

export default class Boot implements IBoot {
  app: Application;
  event: EventEmitter;

  constructor(app: Application) {
    this.app = app;
    this.event = new Event();
    global.app = app;
    global.eventInstance = this.event;
  }

  configWillLoad(): void {
    console.log('ð APP is launching...');
  }

  async didReady() {
    await publishLibraryUpdateMessage();

    this.app.messenger.on(IPC_AGENT_RESOURCE_UPDATE, (result: IResourceActionResult) => {
      this.event.emit(IPC_AGENT_RESOURCE_UPDATE, result);
    });
  }

  async serverDidReady(): Promise<void> {
    console.log('â APP launched');
  }
}

/**
 * åºæ´æ°æ¶ -> åéæ´æ°äºä»¶å° AGENT -> AGENT watch ææèµæåº
 * 
 * æä»¶æ´æ°æ¶ -> AGENT æè·æ·»å æå é¤äºä»¶ -> åéäºä»¶å° APP -> APP éç¥ midway CONFIGURATION -> è°ç¨ resource serviceï¼åææä»¶ç­ï¼ -> æ´æ°åº
 * 
 * ä¸»å¨æ«ææ¶ -> åéæ«ææ¶é´å° AGENT -> éå½ååºèµæåºçæææä»¶ -> éä¸ªåææä»¶ -> åéæä»¶è¯¦æå° APP -> APP éç¥ midway CONFIGURATION -> è°ç¨ resource service -> æ´æ°åº
 */
