import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AzureAdModule } from './auth/azure-ad.module';
import { ConfigModule } from '@nestjs/config';
import { VisitModule } from './visit/visit.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'azure-ad' }),
    VisitModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
