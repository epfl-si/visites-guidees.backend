import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { AzureAdStrategy } from './auth/azure-ad.strategy';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './api/user/user.controller';
import { UserService } from './api/user/user.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), PassportModule.register({ defaultStrategy: 'azure-ad' })],
  controllers: [AppController, UserController],
  providers: [AppService, AzureAdStrategy, UserService],
})
export class AppModule { }