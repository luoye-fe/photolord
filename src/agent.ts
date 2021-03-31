import 'tsconfig-paths/register';

import { Agent } from 'egg';
import { IPC_APP_LIBRARY_UPDATE } from '@/ipc/channel';
import { LibraryModel } from './entity/library';

export default (agent: Agent) => {
  agent.messenger.on(IPC_APP_LIBRARY_UPDATE, (libraryList: LibraryModel[]) => {
    console.log(libraryList);
  });
};
