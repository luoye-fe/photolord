import 'tsconfig-paths/register';

import { Agent } from 'egg';
import * as chokidar from 'chokidar';

import { IPC_APP_LIBRARY_UPDATE, IPC_AGENT_RESOURCE_UPDATE, IPC_AGENT_LIBRARY_SCAN } from '@/ipc/channel';
import { LibraryModel } from '@/entity/library';
import { isImage, analyseFile } from '@/utils/resource';

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

const processFileList: ProcessFile[] = [];
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
      global.agent.logger.info(`Analyse file start: ${filePath}`);
      try {
        const fileInfo = await analyseFile(filePath);
        global.agent.logger.info(`Analyse file success [${Date.now() - start}ms]: ${filePath}`);
        global.agent.messenger.sendToApp(IPC_AGENT_RESOURCE_UPDATE, {
          action,
          libraryId,
          filePath,
          fileInfo,
        });
      } catch (e) {
        global.agent.logger.info(`Analyse file error [${Date.now() - start}ms]: ${filePath}`);
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

/**
 * add watcher for all library
 * @param libraryList 
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

/**
 * TODO: list library all image file and analyse it
 * @param libraryInfo 
 */
function listLibraryAllFile(libraryInfo: LibraryModel) {
  console.log(1111, libraryInfo);
}

export default (agent: Agent) => {
  global.agent = agent;

  agent.messenger.on(IPC_APP_LIBRARY_UPDATE, (libraryList: LibraryModel[]) => {
    handleAllLibrary(libraryList);
  });

  agent.messenger.on(IPC_AGENT_LIBRARY_SCAN, (libraryInfo: LibraryModel) => {
    listLibraryAllFile(libraryInfo);
  });
};
