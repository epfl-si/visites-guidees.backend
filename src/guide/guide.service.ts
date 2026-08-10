import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Guide, User, Language } from '../../generated/prisma/client';
import { ResponseGuideDto } from './dto/response.dto';
import { CreateGuideDto } from './dto/create.dto';
import { ApiService } from '../services/api/api.service';
import { Person } from './interfaces/person.interface';
import { AppLogger as Logger } from '@/logger.service';

@Injectable()
export class GuideService {
  private readonly logger = new Logger(GuideService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly apiService: ApiService,
  ) {}

  private toResponseDto(
    guide: Guide & { user: User; languages: Language[] },
  ): ResponseGuideDto {
    return {
      id: guide.id,
      status: guide.status,
      phone: guide.phone,
      firstName: guide.user.firstName,
      lastName: guide.user.lastName,
      email: guide.user.email,
      username: guide.user.username,
      languages: guide.languages,
    };
  }

  async list(): Promise<ResponseGuideDto[]> {
    const guides = await this.prisma.guide.findMany({
      include: { user: true, languages: true },
    });

    if (guides.length === 0) {
      this.logger.warn('No guide found');
      throw new NotFoundException('No guide found');
    }

    this.logger.log(`Listed ${guides.length} guide(s)`);
    return guides.map((guide) => this.toResponseDto(guide));
  }

  async create(createGuideDto: CreateGuideDto): Promise<ResponseGuideDto> {
    const person = await this.apiService.callEPFLApi<Person>(
      `v1/persons/${createGuideDto.sciper}`,
    );

    if (person == null) {
      throw new NotFoundException('No person found with this sciper');
    }

    const id = Number(person.id);
    const phone = person.phones.map((p) => p.number);

    await this.prisma.user.upsert({
      where: { id },
      update: {
        email: person.email,
        firstName: person.firstname,
        lastName: person.lastname,
        username: person.account.username,
      },
      create: {
        id,
        email: person.email,
        firstName: person.firstname,
        lastName: person.lastname,
        username: person.account.username,
      },
    });

    const guide = await this.prisma.guide.upsert({
      where: { id },
      update: {},
      create: { id, phone },
      include: { user: true, languages: true },
    });

    this.logger.log(`Created guide ${id}`);
    return this.toResponseDto(guide);
  }
}
