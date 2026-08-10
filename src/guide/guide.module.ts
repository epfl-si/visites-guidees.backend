import { Module } from '@nestjs/common';
import { GuideService } from './guide.service';
import { GuideController } from './guide.controller';
import { PrismaService } from '../prisma.service';
import { AzureAdModule } from '../auth/azure-ad.module';
import { ApiModule } from '../services/api/api.module';

@Module({
  imports: [AzureAdModule, ApiModule],
  controllers: [GuideController],
  providers: [GuideService, PrismaService],
})
export class GuideModule {}
