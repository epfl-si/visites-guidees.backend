import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccess } from '@/common/interfaces/response.interface';
import { getRequestId } from '@/common/context/request.context';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccess<T> | void
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccess<T> | void> {
    if (context.getType() !== 'http') {
      return next.handle() as Observable<void>;
    }

    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        if (response.statusCode === Number(HttpStatus.NO_CONTENT)) {
          return;
        }

        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          requestId: getRequestId() ?? 'unknown',
        };
      }),
    );
  }
}
