import { getConnection } from 'typeorm';
import { LibraryModel } from '@/entity/library';
import { IPC_APP_LIBRARY_UPDATE } from '@/ipc/channel';

/**
 * when app launch or library update, publish message to agent with all library
 * @param app
 */
export async function publishLibraryUpdateMessage() {
  const connection = getConnection('default');
  const libraryModel = connection.getRepository(LibraryModel);
  const result = await libraryModel.find({
    where: {
      delete_flag: 0,
    },
  });
  global.app.messenger.sendToAgent(IPC_APP_LIBRARY_UPDATE, result);
}