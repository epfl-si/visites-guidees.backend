import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class LanguageService {
  private readonly logger = new Logger(LanguageService.name);
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const languages = await this.prisma.language.findMany();
    if (languages.length === 0) {
      this.logger.warn('No language found');
      throw new NotFoundException('No language found');
    }

    this.logger.log(`Listed ${languages.length} language(s)`);
    return languages;
  }
}
