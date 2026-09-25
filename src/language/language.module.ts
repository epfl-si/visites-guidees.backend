import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { PrismaService } from '@/prisma.service';
@Module({
  providers: [PrismaService, LanguageService],
  controllers: [LanguageController],
})
export class LanguageModule {}
