import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { UseGuards, Req } from '@nestjs/common';
import { AzureAdGuard } from '../auth/azure-ad-auth.guard';
import { UserService } from './user.service';
import { ReqEntraOauthUser } from '../types/auth';
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AzureAdGuard)
  @Get('me')
  getProtected(@Req() req: { user: ReqEntraOauthUser }) {
    return this.userService.FormatUserInfo(req.user);
  }
}
