// azure-ad-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReqEntraOauthUser } from '../types/auth.js';

@Injectable()
export class AzureAdGuard extends AuthGuard('azure-ad') {
  handleRequest<TUser = ReqEntraOauthUser>(err: any, user: TUser): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
