// azure-ad.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  BearerStrategy,
  IBearerStrategyOptionWithRequest,
} from 'passport-azure-ad';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureAdStrategy extends PassportStrategy(
  BearerStrategy,
  'azure-ad',
) {
  constructor() {
    super({
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0/.well-known/openid-configuration`,
      clientID: process.env.AZURE_AD_CLIENT_ID!,
      audience: process.env.AZURE_AD_CLIENT_ID!,
      validateIssuer: true,
      passReqToCallback: false,
      loggingLevel: 'info', // was 'warn'
      loggingNoPII: false, // temporarily, for debugging only
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
