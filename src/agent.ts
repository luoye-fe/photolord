import 'tsconfig-paths/register';
import path from 'path';
import fse from 'fs-extra';

import { Agent } from 'egg';
import * as chokidar from 'chokidar';

import { IPC_APP_LIBRARY_UPDATE, IPC_AGENT_RESOURCE_UPDATE, IPC_APP_LIBRARY_SCAN } from '@/ipc/channel';
import { LibraryModel } from '@/entity/library';
import { isImage } from '@/utils/resource';
import { IResourceActionResult } from './typings';

interface WatcherItem extends LibraryModel {
  watcher: chokidar.FSWatcher;
}

const watchOptions: chokidar.WatchOptions = {
  persistent: true,
  awaitWriteFinish: true,
  ignoreInitial: true,
  ignored: /(^|[\/\\])\../, // ignore hidden file
};

class AgentBoot {
  private watcherList = new Map<string, WatcherItem>();

  constructor(agent: Agent) {
    global.agent = agent;

    agent.messenger.on(IPC_APP_LIBRARY_UPDATE, (libraryList: LibraryModel[]) => {
      this.handleAllLibrary(libraryList);
    });

    agent.messenger.on(IPC_APP_LIBRARY_SCAN, (libraryInfo: LibraryModel) => {
      this.handleLibraryAllResource(libraryInfo);
    });
  }

  private publishMessage(target: IResourceActionResult) {
    const { action, libraryId, resourcePath } = target;
    global.agent.logger.info(`Library [${libraryId}] resource [${action}]: ${resourcePath}`);
    global.agent.messenger.sendToApp(IPC_AGENT_RESOURCE_UPDATE, {
      action,
      libraryId,
      resourcePath,
    });
  }

  /**
   * add watcher for all libraries
   */
  handleAllLibrary(libraryList: LibraryModel[]) {
    libraryList.forEach(item => {
      const { path: libraryPath, id } = item;

      const existWatcherItem = this.watcherList.get(libraryPath);
      if (existWatcherItem) return;

      const watcher = chokidar.watch(libraryPath, watchOptions);

      watcher
        .on('add', path => {
          if (isImage(path)) {
            this.publishMessage({ action: 'add', libraryId: id, resourcePath: path });
          }
        })
        .on('unlink', path => {
          if (isImage(path)) {
            this.publishMessage({ action: 'unlink', libraryId: id, resourcePath: path });
          }
        });

      this.watcherList.set(libraryPath, {
        ...item,
        watcher,
      });
    });

    // close watcher and remove watchItem
    this.watcherList.forEach(async (item) => {
      if (libraryList.find(i => i.path === item.path)) return;
      await item.watcher.close();
      this.watcherList.delete(item.path);
    });
  }

  /**
   * recursive all dir
   * @param libraryInfo 
   */
  handleLibraryAllResource(libraryInfo: LibraryModel) {
    const { path: libraryPath, id } = libraryInfo;

    const handleOneDir = async (currentDir: string) => {
      const files = await fse.readdir(currentDir);

      for (let i = 0; i < files.length; i += 1) {
        const current = files[i];
        const currentPath = path.join(currentDir, current);

        const stat = await fse.stat(currentPath);

        if (stat.isFile() && isImage(currentPath)) {
          this.publishMessage({ action: 'add', libraryId: id, resourcePath: currentPath });
        }

        if (stat.isDirectory()) {
          handleOneDir(currentPath);
        }
      }
    };

    handleOneDir(libraryPath);
  }
}

export default (agent: Agent) => new AgentBoot(agent);
