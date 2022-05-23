import { ValidationError } from 'class-validator';
import { BaseResponse } from '../responses/base.response';
import { ErrorCode } from '../constants/errorcode.constant';

export const normalError = (errors: ValidationError[]): BaseResponse<null> => {
  const response = new BaseResponse<null>();
  const constraints = errors[0].constraints;
  let message: string = ErrorCode.BAD_REQUEST;

  if (constraints) {
    for (const k of Object.keys(constraints)) {
      message = constraints[k];
      break;
    }
  }

  response.code = message;
  return response;
};
