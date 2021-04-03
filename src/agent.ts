import 'tsconfig-paths/register';

import { Agent } from 'egg';
import * as chokidar from 'chokidar';

import { IPC_APP_LIBRARY_UPDATE } from '@/ipc/channel';
import { LibraryModel } from '@/entity/library';

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
  ignoreInitial: true,
  ignored: /(^|[\/\\])\../, // ignore hidden file
};

const watcherList = new Map<string, WatcherItem>();

let processing = false;
function listenFileChange() {
  if (processing) return;
  processing = true;

  function handleOneFile() {
    const target = processFileList[0];
    if (!target) {
      processing = false;
      return;
    }

    // analyze file -> exif object face ...
    console.log('正在处理');
    console.log(target);

    setTimeout(() => {
      console.log('处理完毕\n');
      processFileList.shift();
      handleOneFile();
    }, 3000);
  }

  handleOneFile();
}

const processFileList: ProcessFile[] = new Proxy([], {
  set(obj, key, val) {
    Reflect.set(obj, key, val);
    if (key !== 'length') listenFileChange();
    return true;
  },
});


function handleAllLibrary(libraryList: LibraryModel[]) {
  libraryList.forEach(item => {
    const { path: libraryPath, id } = item;

    const existWatcherItem = watcherList.get(libraryPath);
    if (existWatcherItem) return;

    const watcher = chokidar.watch(libraryPath, watchOptions);

    watcher
      .on('add', path => processFileList.push({ action: 'add', libraryId: id, filePath: path }))
      .on('change', path => processFileList.push({ action: 'change', libraryId: id, filePath: path }))
      .on('unlink', path => processFileList.push({ action: 'unlink', libraryId: id, filePath: path }));

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
