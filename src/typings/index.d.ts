import { StatusCodes } from 'http-status-codes';

interface IPlainObject {
  [key: string]: any;
}

interface IResponse {
  code: StatusCodes;
  message: string;
  data: IPlainObject;
}
