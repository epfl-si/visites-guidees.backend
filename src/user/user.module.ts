import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { AzureAdModule } from '../auth/azure-ad.module';

@Module({
  imports: [AzureAdModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
