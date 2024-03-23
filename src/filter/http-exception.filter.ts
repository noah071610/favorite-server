import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const res = exception.getResponse() as any;
    if (typeof res === 'object') {
      response.status(status).json({
        msg: res.msg,
        data: res.data,
        status,
      });
    } else {
      response.status(status).json({
        msg: exception.getResponse(),
        data: undefined,
        status,
      });
    }
  }
}
