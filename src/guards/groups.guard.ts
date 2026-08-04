import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { REQUIRED_GROUPS_KEY } from '../decorators/require-groups.decorator';
import { ReqEntraOauthUser } from '../types/auth.js';

@Injectable()
export class GroupsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredGroups = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_GROUPS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredGroups || requiredGroups.length === 0) {
      return true; // Seams useless but if it's use globally you will not need to add the decorator Public if there is no defined groups with  RequireGroups('SomeGroup')
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as ReqEntraOauthUser;

    const hasRequiredGroup = requiredGroups.some((group) =>
      user.groups.includes(group),
    );

    if (!hasRequiredGroup) {
      throw new ForbiddenException();
    }

    return true;
  }
}
