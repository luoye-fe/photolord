import { Application } from 'egg';
import { IBoot } from 'midway';

import { publishLibraryUpdateMessage } from '@/ipc/index';
import { IPC_AGENT_LIBRARY_UPDATE, IPC_AGENT_RESOURCE_UPDATE } from '@/ipc/channel';

export default class Boot implements IBoot {
  app: Application;

  constructor(app: Application) {
    this.app = app;
    global.app = app;
  }

  configWillLoad(): void {
    console.log('🚀 APP is launching...');
  }

  async didReady() {
    await publishLibraryUpdateMessage();

    // listen library result from agent, update to database
    this.app.messenger.on(IPC_AGENT_LIBRARY_UPDATE, (result) => {
      console.log(result);
    });

    // listen resource result from agent, update to database
    this.app.messenger.on(IPC_AGENT_RESOURCE_UPDATE, (result) => {
      console.log(result);
    });
  }

  async serverDidReady(): Promise<void> {
    console.log('✅ APP launched');
  }

  async beforeClose() {
    // tell agent close all watch
    this.app.messenger.sendToAgent('app_close', {});
  }
}
