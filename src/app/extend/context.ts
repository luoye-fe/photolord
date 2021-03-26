import { Context } from 'egg';
import { StatusCodes } from 'http-status-codes';

import ErrorCode from '@/const/error-code/index';
import { IPlainObject, IResponse } from '@/typings/index';

export function success(this: Context, data: IPlainObject = {}): IResponse {
  const result = {
    code: 200,
    message: ErrorCode.Success,
    data,
  };

  this.body = result;

  return result;
}

export function fail(this: Context, httpCode: StatusCodes, message: string, data: IPlainObject = {}): IResponse {
  const result = {
    code: httpCode,
    message: message || ErrorCode.Unknown,
    data,
  };

  this.body = result;
  
  return result;
}

export const errorCode = ErrorCode;
