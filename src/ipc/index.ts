import { getConnection } from 'typeorm';
import { LibraryModel } from '@/entity/library';
import { IPC_APP_LIBRARY_SCAN, IPC_APP_LIBRARY_UPDATE } from '@/ipc/channel';

/**
 * send library update message to agent
 * @param app
 */
export async function publishLibraryUpdateMessage() {
  const connection = getConnection('default');
  const libraryModel = connection.getRepository(LibraryModel);
  const result = await libraryModel.find();
  global.app.messenger.sendToAgent(IPC_APP_LIBRARY_UPDATE, result);
}

/**
 * send library scan message to agent
 */
export async function publishLibraryScanMessage(libraryInfo: LibraryModel) {
  global.app.messenger.sendToAgent(IPC_APP_LIBRARY_SCAN, libraryInfo);
}
