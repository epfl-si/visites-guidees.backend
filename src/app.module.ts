import { Module } from '@nestjs/common';
import { VisitController } from './api/visit/visit.controller';
import { VisitService } from './api/visit/visit.service';
import { PassportModule } from '@nestjs/passport';
import { AzureAdStrategy } from './auth/azure-ad.strategy';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './api/user/user.controller';
import { UserService } from './api/user/user.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'azure-ad' }),
  ],
  controllers: [VisitController, UserController],
  providers: [VisitService, AzureAdStrategy, UserService, PrismaService],
})
export class AppModule {}
