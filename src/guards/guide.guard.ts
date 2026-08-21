import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ReqEntraOauthUser } from '../types/auth.js';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GuideGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as ReqEntraOauthUser;

    const guide = await this.prisma.guide.findUnique({
      where: { id: Number(user.uniqueid) },
      select: { status: true },
    });

    if (!guide || guide.status !== "ACTIVE") {
      throw new ForbiddenException('Your are not an active guide');
    }

    return true;
  }
}