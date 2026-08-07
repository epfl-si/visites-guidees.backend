import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ReqEntraOauthUser, UserInfo } from '../types/auth';
import { PrismaService } from '../prisma.service';
import { ResponseFromEPFLApi } from '../types/user';
import { ResponseUserSearch } from './dto/response-user-dto';
import { callEPFLApi } from '../lib/api';

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

  async search(params: string) {

    const data: ResponseFromEPFLApi = await callEPFLApi<ResponseFromEPFLApi>(
      `v1/persons?query=${params}&pagesize=5`
    );

    if (!data) {
      return [];
    }

    const users: ResponseUserSearch[] = [];

    data.persons.map((u, _index) => (
      users.push({
        sciper: Number(u.id),
        lastName: u.lastname,
        firstName: u.firstname
      })
    ));

    return users;
  }
}
