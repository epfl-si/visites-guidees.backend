import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ReqEntraOauthUser } from '../types/auth';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ReqEntraOauthUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as ReqEntraOauthUser;
  },
);
