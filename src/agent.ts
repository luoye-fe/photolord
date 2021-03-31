import 'tsconfig-paths/register';

import { Agent } from 'egg';
import { IPC_APP_LIBRARY_UPDATE } from '@/ipc/channel';
import { LibraryModel } from '@/entity/library';
import { handleAllLibrary } from '@/utils/library';

export default (agent: Agent) => {
  global.agent = agent;

  agent.messenger.on(IPC_APP_LIBRARY_UPDATE, (libraryList: LibraryModel[]) => {
    handleAllLibrary(libraryList);
  });
};
