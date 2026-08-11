import { Injectable } from '@nestjs/common';
import { ReqEntraOauthUser, UserInfo } from '../types/auth';
import { PrismaService } from '../prisma.service';
import { PersonsSearchResponse } from '../guide/interfaces/person.interface';
import { ResponseUserSearch } from './dto/response-user-dto';
import { ApiService } from '../services/api/api.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiService: ApiService,
  ) {}

  async FormatUserInfo(Req: ReqEntraOauthUser): Promise<UserInfo> {
    const guide = await this.prisma.guide.findUnique({
      where: {
        id: Number(Req.uniqueid),
      },
    });

    const data: UserInfo = {
      sciper: Number(Req.uniqueid),
      gaspar: Req.gaspar,
      firstName: Req.given_name,
      lastName: Req.family_name,
      mail: Req.mail,
      isAdmin: Req.groups.includes('visites-guidees-admins_AppGrpU'),
      isGuide: guide ? true : false,
    };
    return data;
  }

  async search(params: string) {
    const data = await this.apiService.callEPFLApi<PersonsSearchResponse>(
      `v1/persons?query=${params}&pagesize=5&isaccredited=1`,
    );

    if (!data) {
      return [];
    }

    const users: ResponseUserSearch[] = [];

    data.persons.forEach((u) => {
      users.push({
        sciper: Number(u.id),
        lastName: u.lastname,
        firstName: u.firstname,
      });
    });

    return users;
  }
}
