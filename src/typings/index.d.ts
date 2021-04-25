import { Agent, Application } from 'egg';
import { StatusCodes } from 'http-status-codes';

interface IPlainObject {
  [key: string]: any;
}

interface IResponse {
  code: StatusCodes;
  message: string;
  data: IPlainObject;
}

interface IResourceInfo {
  md5: string;
  path: string;
  name: string;
  format: string;
  width: number;
  height: number;
  size: number;
  createDate: Date;
  modifyDate: Date;
  exif: IPlainObject;
}

interface IResourceActionResult {
  action: 'add' | 'unlink';
  libraryId: number;
  resourcePath: string;
}

declare global {
  namespace NodeJS {
    interface Global {
      app: Application;
      agent: Agent;
      eventInstance: EventEmitter;
    }
  }
}
