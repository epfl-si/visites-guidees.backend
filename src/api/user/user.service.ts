import { Injectable } from '@nestjs/common';
import { ReqEntraOauthUser, UserInfo } from '../../types/Auth';

@Injectable()
export class UserService {
  FormatUserInfo(Req: ReqEntraOauthUser): UserInfo {
    const data: UserInfo = {
      sciper: Number(Req.uniqueid),
      gaspar: Req.gaspar,
      firstName: Req.given_name,
      lastName: Req.family_name,
      mail: Req.mail,
      groups: Req.groups,
    };
    return data;
  }
}
