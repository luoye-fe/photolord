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

declare global {
  namespace NodeJS {
    interface Global {
      app: Application;
      agent: Agent;
    }
  }
}
