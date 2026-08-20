import { Injectable } from '@nestjs/common';
import { ReqEntraOauthUser, UserInfo } from '../types/auth';
import { PrismaService } from '../prisma.service';
import { PersonsSearchResponse } from '@/services/api/interfaces/person.interface';
import { ResponseUserSearch } from './dto/response-user-dto';
import { ApiService } from '../services/api/api.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiService: ApiService,
  ) { }

  async FormatUserInfo(Req: ReqEntraOauthUser): Promise<UserInfo> {
    const guide = await this.prisma.guide.findUnique({
      where: {
        id: Number(Req.uniqueid),
      },
    });

    const ADMIN_GROUP = 'visites-guidees-admins_AppGrpU';

    const roles = [
      Req.groups.includes(ADMIN_GROUP) && "admin",
      guide && "guide"
    ].filter((role): role is string => Boolean(role));

    const data: UserInfo = {
      sciper: Number(Req.uniqueid),
      username: Req.gaspar,
      firstName: Req.given_name,
      lastName: Req.family_name,
      mail: Req.mail,
      roles: roles,
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
