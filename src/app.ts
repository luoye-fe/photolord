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

    this.app.messenger.on(IPC_AGENT_RESOURCE_UPDATE, (result: IResourceActionResult) => {
      this.event.emit(IPC_AGENT_RESOURCE_UPDATE, result);
    });
  }

  async serverDidReady(): Promise<void> {
    console.log('✅ APP launched');
  }
}

/**
 * 库更新时 -> 发送更新事件到 AGENT -> AGENT watch 所有资料库
 * 
 * 文件更新时 -> AGENT 捕获添加或删除事件 -> 分析文件 -> 发送文件详情到 APP -> APP 通知 midway CONFIGURATION -> 调用 resource service -> 更新库
 * 
 * 主动扫描时 -> 发送扫描时间到 AGENT -> 递归列出资料库的所有文件 -> 逐个分析文件 -> 发送文件详情到 APP -> APP 通知 midway CONFIGURATION -> 调用 resource service -> 更新库
 */
