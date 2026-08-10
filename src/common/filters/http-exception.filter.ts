import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiError } from '@/common/interfaces/response.interface';
import { getRequestId } from '@/common/context/request.context';

interface HttpExceptionBody {
  message?: string | string[];
  error?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  private readonly isProd = process.env.NODE_ENV === 'production';

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      this.logger.error('Unhandled non-HTTP exception', exception);
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (response.headersSent) {
      this.logger.error(
        'Exception occurred after response headers were sent',
        exception,
      );
      return;
    }

    const requestId = getRequestId() ?? 'unknown';

    const isHttpException = exception instanceof HttpException;
    const code = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string[];
    let error: string;

    if (isHttpException) {
      const body = exception.getResponse();

      if (typeof body === 'string') {
        message = [body];
        error = exception.constructor.name;
      } else {
        const typedBody = body as HttpExceptionBody;
        const rawMessage = typedBody.message ?? exception.message;
        message = Array.isArray(rawMessage) ? rawMessage : [rawMessage];
        error = typedBody.error ?? exception.constructor.name;
      }
    } else {
      message = [
        !this.isProd && exception instanceof Error
          ? exception.message
          : 'Internal server error',
      ];
      error = 'Internal server error';
    }

    const context = `[${requestId}] ${request.method} ${request.url} → ${code}`;

    if (code >= 500) {
      const detail =
        exception instanceof Error
          ? exception.stack
          : JSON.stringify(exception);
      this.logger.error(`Unhandled exception on ${context}`, detail);
    } else if (code >= 400) {
      this.logger.warn(context);
    }

    const errorResponse: ApiError = {
      success: false,
      message,
      error,
      code,
      timestamp: new Date().toISOString(),
      requestId,
    };

    response.setHeader('x-request-id', requestId);
    response.status(code).json(errorResponse);
  }
}
