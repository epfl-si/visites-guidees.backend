export interface ReqEntraOauthUser {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  aio: string;
  azp: string;
  azpacr: string;
  groups: Array<string>;
  oid: string;
  preferred_username: string;
  rh: string;
  scp: string;
  sid: string;
  sub: string;
  tid: string;
  uti: string;
  ver: string;
  xms_ftd: string;
  uniqueid: string;
  gaspar: string;
  given_name: string;
  family_name: string;
  mail: string;
}

export interface UserInfo {
  sciper: number;
  gaspar: string;
  firstName: string;
  lastName: string;
  mail: string;
  groups: Array<string>;
}
