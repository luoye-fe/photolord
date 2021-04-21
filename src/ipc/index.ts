import { getConnection } from 'typeorm';
import { LibraryModel } from '@/entity/library';
import { IPC_AGENT_LIBRARY_SCAN, IPC_APP_LIBRARY_UPDATE } from '@/ipc/channel';

/**
 * when app launch or library update (create & delete), publish message to agent with all library
 * @param app
 */
export async function publishLibraryUpdateMessage() {
  const connection = getConnection('default');
  const libraryModel = connection.getRepository(LibraryModel);
  const result = await libraryModel.find();
  global.app.messenger.sendToAgent(IPC_APP_LIBRARY_UPDATE, result);
}

/**
 * publish library scan message
 */
export async function publishLibraryScanMessage(libraryInfo: LibraryModel) {
  global.app.messenger.sendToAgent(IPC_AGENT_LIBRARY_SCAN, libraryInfo);
}
