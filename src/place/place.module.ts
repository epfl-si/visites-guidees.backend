import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { PrismaService } from '../prisma.service';
import { AzureAdModule } from '../auth/azure-ad.module';

@Module({
  imports: [AzureAdModule],
  controllers: [PlaceController],
  providers: [PlaceService, PrismaService],
})
export class PlaceModule {}
