import * as chokidar from 'chokidar';
import { LibraryModel } from '@/entity/library';

let watcher: chokidar.FSWatcher | null = null;

const watchOptions: chokidar.WatchOptions = {
  persistent: true,
  ignoreInitial: true,
  ignored: /(^|[\/\\])\../, // ignore hidden file
};

export function handleAllLibrary(list: LibraryModel[]) {
  const { logger } = global.agent;
  
  logger.info('Library update, re-watch all library.');
  list.forEach(item => {
    const { path: libraryPath } = item;
    if (!watcher) {
      watcher = chokidar.watch(libraryPath, watchOptions);

      watcher
        .on('add', path => logger.info(`File ${path} has been added`))
        .on('change', path => logger.info(`File ${path} has been changed`))
        .on('unlink', path => logger.info(`File ${path} has been removed`));
    }

    const watchedPath = watcher.getWatched();
    if (Object.keys(watchedPath).find(i => i === libraryPath)) return;

    watcher.add(libraryPath);
  });

  logger.info(`Watched library list, ${list.map(i => i.path).join(' | ')}`);
}
