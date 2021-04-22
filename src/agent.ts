import 'tsconfig-paths/register';

import { Agent } from 'egg';
import * as chokidar from 'chokidar';

import { IPC_APP_LIBRARY_UPDATE, IPC_AGENT_RESOURCE_UPDATE, IPC_APP_LIBRARY_SCAN } from '@/ipc/channel';
import { LibraryModel } from '@/entity/library';
import { isImage, analyseResource } from '@/utils/resource';

interface ProcessResource {
  action: 'add' | 'change' | 'unlink';
  libraryId: number;
  resourcePath: string;
}

interface WatcherItem extends LibraryModel {
  watcher: chokidar.FSWatcher;
}

const watchOptions: chokidar.WatchOptions = {
  persistent: true,
  awaitWriteFinish: true,
  ignoreInitial: true,
  ignored: /(^|[\/\\])\../, // ignore hidden file
};

const processResourceList: ProcessResource[] = [];
const watcherList = new Map<string, WatcherItem>();

let processing = false;
function handleResourceChange() {
  if (processing) return;
  processing = true;

  async function handleOneResource() {
    const target = processResourceList[0];
    if (!target) {
      processing = false;
      return;
    }

    const { action, libraryId, resourcePath } = target;
    global.agent.logger.info(`Library [${libraryId}] resource [${action}]: ${resourcePath}`);

    if (action === 'add') {
      const start = Date.now();
      global.agent.logger.info(`Analyse resource start: ${resourcePath}`);
      try {
        const resourceInfo = await analyseResource(resourcePath);
        global.agent.logger.info(`Analyse resource success [${Date.now() - start}ms]: ${resourcePath}`);
        global.agent.messenger.sendToApp(IPC_AGENT_RESOURCE_UPDATE, {
          action,
          libraryId,
          resourcePath,
          resourceInfo,
        });
      } catch (e) {
        global.agent.logger.info(`Analyse resource error [${Date.now() - start}ms]: ${resourcePath}`);
        global.agent.logger.error(e);
      }
    }

    if (action === 'unlink') {
      global.agent.messenger.sendToApp(IPC_AGENT_RESOURCE_UPDATE, {
        action,
        libraryId,
        resourcePath,
        resourceInfo: null,
      });
    }

    processResourceList.shift();
    handleOneResource();
  }

  handleOneResource();
}

/**
 * add watcher for all libraries
 */
function handleAllLibrary(libraryList: LibraryModel[]) {
  libraryList.forEach(item => {
    const { path: libraryPath, id } = item;

    const existWatcherItem = watcherList.get(libraryPath);
    if (existWatcherItem) return;

    const watcher = chokidar.watch(libraryPath, watchOptions);

    watcher
      .on('add', path => {
        if (isImage(path)) {
          processResourceList.push({ action: 'add', libraryId: id, resourcePath: path });
          handleResourceChange();
        }
      })
      .on('unlink', path => {
        if (isImage(path)) {
          processResourceList.push({ action: 'unlink', libraryId: id, resourcePath: path });
          handleResourceChange();
        }
      });

    watcherList.set(libraryPath, {
      ...item,
      watcher,
    });
  });

  // close watcher and remove watchItem
  watcherList.forEach(async (item) => {
    if (libraryList.find(i => i.path === item.path)) return;
    await item.watcher.close();
    watcherList.delete(item.path);
  });
}

/**
 * TODO: 递归处理资料库中的所有文件
 * @param libraryInfo 
 */
function handleLibraryAllResource(libraryInfo: LibraryModel) {
  console.log(1111, libraryInfo);
  // 遍历每个文件夹
  // 分析每个图片文件
  // 发出分析完成事件
}

export default (agent: Agent) => {
  global.agent = agent;

  agent.messenger.on(IPC_APP_LIBRARY_UPDATE, (libraryList: LibraryModel[]) => {
    handleAllLibrary(libraryList);
  });

  agent.messenger.on(IPC_APP_LIBRARY_SCAN, (libraryInfo: LibraryModel) => {
    handleLibraryAllResource(libraryInfo);
  });
};
