import 'tsconfig-paths/register';

import { Agent } from 'egg';
import * as chokidar from 'chokidar';

import { IPC_APP_LIBRARY_UPDATE, IPC_AGENT_RESOURCE_UPDATE } from '@/ipc/channel';
import { LibraryModel } from '@/entity/library';
import { isImage, analyzeFile } from '@/utils/resource';

interface ProcessFile {
  action: 'add' | 'change' | 'unlink';
  libraryId: number;
  filePath: string;
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

const watcherList = new Map<string, WatcherItem>();

let processing = false;
function listenFileChange() {
  if (processing) return;
  processing = true;

  async function handleOneFile() {
    const target = processFileList[0];
    if (!target) {
      processing = false;
      return;
    }

    const { action, libraryId, filePath } = target;
    global.agent.logger.info(`Library [${libraryId}] file [${action}]: ${filePath}`);

    if (action === 'add') {
      const start = Date.now();
      global.agent.logger.info(`Analyze file start: ${filePath}`);
      try {
        const fileInfo = await analyzeFile(filePath);
        global.agent.logger.info(`Analyze file success [${Date.now() - start}ms]: ${filePath}`);
        global.agent.messenger.sendToApp(IPC_AGENT_RESOURCE_UPDATE, {
          action,
          libraryId,
          filePath,
          fileInfo,
        });
      } catch (e) {
        global.agent.logger.info(`Analyze file error [${Date.now() - start}ms]: ${filePath}`);
        global.agent.logger.error(e);
      }
    }

    if (action === 'unlink') {
      global.agent.messenger.sendToApp(IPC_AGENT_RESOURCE_UPDATE, {
        action,
        libraryId,
        filePath,
        fileInfo: null,
      });
    }

    processFileList.shift();
    handleOneFile();
  }

  handleOneFile();
}

const processFileList: ProcessFile[] = [];
function handleAllLibrary(libraryList: LibraryModel[]) {
  libraryList.forEach(item => {
    const { path: libraryPath, id } = item;

    const existWatcherItem = watcherList.get(libraryPath);
    if (existWatcherItem) return;

    const watcher = chokidar.watch(libraryPath, watchOptions);

    watcher
      .on('add', path => {
        if (isImage(path)) {
          processFileList.push({ action: 'add', libraryId: id, filePath: path });
          listenFileChange();
        }
      })
      .on('unlink', path => {
        if (isImage(path)) {
          processFileList.push({ action: 'unlink', libraryId: id, filePath: path });
          listenFileChange();
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

export default (agent: Agent) => {
  global.agent = agent;

  agent.messenger.on(IPC_APP_LIBRARY_UPDATE, (libraryList: LibraryModel[]) => {
    handleAllLibrary(libraryList);
  });
};
