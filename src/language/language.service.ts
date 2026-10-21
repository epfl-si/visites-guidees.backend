import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Logger } from '@nestjs/common';
import { LanguageDto } from './dto/language.dto';
import { CreateLanguageDto } from './dto/create.dto';

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

  async create(createLanguageDto: CreateLanguageDto): Promise<LanguageDto> {
    const lang = await this.prisma.language.findMany({
      where: {
        OR: [
          { code: createLanguageDto.code },
          { name: createLanguageDto.name },
        ],
      },
    });

    if (lang.length > 0) {
      this.logger.warn(
        `There is another language with a code : ${createLanguageDto.code} or a name with : ${createLanguageDto.name}.`,
      );
      throw new ConflictException(
        `There is another language with a code : ${createLanguageDto.code} or a name with : ${createLanguageDto.name}.`,
      );
    }

    const language = await this.prisma.language.create({
      data: {
        name: createLanguageDto.name,
        code: createLanguageDto.code,
      },
    });

    this.logger.log(`New language create : ${createLanguageDto.name}.`);

    return language;
  }
}
