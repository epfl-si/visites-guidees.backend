import { Controller, Query } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { UseGuards, Req } from '@nestjs/common';
import { AzureAdGuard } from '../auth/azure-ad-auth.guard';
import { UserService } from './user.service';
import { ReqEntraOauthUser } from '../types/auth';
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AzureAdGuard)
  @Get('me')
  getProtected(@Req() req: { user: ReqEntraOauthUser }) {
    return this.userService.FormatUserInfo(req.user);
  }

  @Get('search')
  searchUsers(@Query('query') query: string) {
    return this.userService.search(query);
  }
}
