import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCode } from 'src/common/constants';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof Error) {
      this.logger.error({
        message: exception.message,
        exception: exception.stack,
      });
    } else {
      this.logger.error({
        exception: exception,
      });
      console.log('Exception: ', exception);
    }
    if (exception instanceof BadRequestException) {
      console.log('yoona')
      const errorResponse = exception.getResponse();
      response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    } else if (exception instanceof UnauthorizedException) {
      const errorResponse = exception.getResponse();
      response.status(HttpStatus.UNAUTHORIZED).json(errorResponse);
    } else if (exception instanceof ForbiddenException) {
      const errorResponse = exception.getResponse();
      response.status(HttpStatus.FORBIDDEN).json(errorResponse);
    } else if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: ErrorCode.GENERAL_ERROR,
      });
    }
  }
}
