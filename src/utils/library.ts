import * as chokidar from 'chokidar';
import { LibraryModel } from '@/entity/library';

interface ProcessFile {
  action: 'add' | 'change' | 'unlink';
  filePath: string;
}

interface WatcherItem extends LibraryModel{
  watcher: chokidar.FSWatcher;
  processFileList: ProcessFile[];
}

let watcherList: WatcherItem[] = [];

const watchOptions: chokidar.WatchOptions = {
  persistent: true,
  ignoreInitial: true,
  ignored: /(^|[\/\\])\../, // ignore hidden file
};

export function handleAllLibrary(list: LibraryModel[]) {
  const { logger } = global.agent;
  logger.info('Library update, re-watch all library.');

  const resultWatcherList = [];

  list.forEach(item => {
    const { path: libraryPath } = item;

    const existWatcherItem = watcherList.find(i => i.path === libraryPath);
    if (existWatcherItem) {
      resultWatcherList.push(item);
      return;
    }

    const watcher = chokidar.watch(libraryPath, watchOptions);

    watcher
      .on('add', path => logger.info(`File ${path} has been added`))
      .on('change', path => logger.info(`File ${path} has been changed`))
      .on('unlink', path => logger.info(`File ${path} has been removed`));

    resultWatcherList.push({
      ...item,
      watcher,
      processFileList: [],
    });
  });

  // close watcher
  watcherList.forEach(async (item) => {
    if (list.find(i => i.path === item.path)) return;
    await item.watcher.close();
  });

  watcherList = resultWatcherList;

  logger.info(`Watched library list, ${watcherList.map(i => i.path).join(' | ')}`);
}
