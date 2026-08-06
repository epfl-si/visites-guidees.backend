import { Module } from '@nestjs/common';
import { GuideService } from './guide.service';
import { GuideController } from './guide.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [GuideController],
  providers: [GuideService, PrismaService],
})
export class GuideModule {}
