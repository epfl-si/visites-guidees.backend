import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { AzureAdModule } from '../auth/azure-ad.module';
import { ApiModule } from '../services/api/api.module';

@Module({
  imports: [AzureAdModule, ApiModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
