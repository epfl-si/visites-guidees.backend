import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Logger } from '@nestjs/common';
import { LanguageDto } from './dto/language.dto';

@Injectable()
export class LanguageService {
  private readonly logger = new Logger(LanguageService.name);
  constructor(private prisma: PrismaService) {}

  async list(): Promise<LanguageDto[]> {
    const languages = await this.prisma.language.findMany();
    if (languages.length === 0) {
      this.logger.warn('No language found');
      throw new NotFoundException('No language found');
    }

    this.logger.log(`Listed ${languages.length} language(s)`);
    return languages;
  }

  async read(id: number): Promise<LanguageDto> {
    const language = await this.prisma.language.findUnique({
      where: { id },
    });

    if (!language) {
      this.logger.warn(`No language found at id : ${id}`);
      throw new NotFoundException(`No language found at id : ${id}`);
    }
    this.logger.log(`Read language #${id}`);
    return language;
  }
}
