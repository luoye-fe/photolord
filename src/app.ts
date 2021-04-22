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
    console.log('🚀 APP is launching...');
  }

  async didReady() {
    await publishLibraryUpdateMessage();

    // listen resource result from agent, update to database
    this.app.messenger.on(IPC_AGENT_RESOURCE_UPDATE, (result: IResourceActionResult) => {
      // egg app.js cant use midway service, emit to midway configuration
      this.event.emit(IPC_AGENT_RESOURCE_UPDATE, result);
    });
  }

  async serverDidReady(): Promise<void> {
    console.log('✅ APP launched');
  }
}
