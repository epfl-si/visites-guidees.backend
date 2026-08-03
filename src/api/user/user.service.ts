import { Injectable } from '@nestjs/common';
import { ReqEntraOauthUser, UserInfo } from '../../types/auth';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async FormatUserInfo(Req: ReqEntraOauthUser): Promise<UserInfo> {
    const isGuide = await this.prisma.guideInfo.findUnique({
      where: {
        sciper: Number(Req.uniqueid),
      },
    });

    const data: UserInfo = {
      sciper: Number(Req.uniqueid),
      gaspar: Req.gaspar,
      firstName: Req.given_name,
      lastName: Req.family_name,
      mail: Req.mail,
      isAdmin: Req.groups.includes('guided-tours-admin_AppGrpU'),
      isGuide: isGuide ? true : false,
    };
    return data;
  }
}
