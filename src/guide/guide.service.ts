import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { ListGuideDto } from './dto/list.dto';
import { ReadGuideDto } from './dto/read.dto';
import { CreateGuideDto } from './dto/create.dto';
import { UpdateGuideDto } from './dto/update.dto';
import { ApiService } from '../services/api/api.service';
import { Person } from '../services/api/interfaces/person.interface';
import { AppLogger as Logger } from '@/logger.service';

@Injectable()
export class GuideService {
  private readonly logger = new Logger(GuideService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly apiService: ApiService,
  ) { }

  async list(): Promise<ListGuideDto[]> {
    const guides = await this.prisma.guide.findMany({
      include: { user: true, languages: true },
    });

    if (guides.length === 0) {
      this.logger.warn('No guide found');
      throw new NotFoundException('No guide found');
    }

    this.logger.log(`Listed ${guides.length} guide(s)`);
    return guides;
  }

  async read(id: number): Promise<ReadGuideDto> {
    const guide = await this.prisma.guide.findUnique({
      where: { id },
      include: { user: true, languages: true, blockedPeriods: true },
    });

    if (!guide) {
      this.logger.warn(`No guide found with id ${id}`);
      throw new NotFoundException(`No guide found with id ${id}`);
    }

    this.logger.log(`Read guide ${id}`);
    return guide as ReadGuideDto;
  }

  async create(createGuideDto: CreateGuideDto): Promise<ReadGuideDto> {
    const person = await this.apiService.callEPFLApi<Person>(
      `v1/persons/${createGuideDto.sciper}`,
    );

    if (person == null || !person.isaccredited) {
      throw new NotFoundException('No person found with this sciper');
    }

    const id = Number(person.id);
    const phone = person.phones?.map((p) => p.number) ?? [];
    const email = person.email || person.account.username + '@epfl.ch';

    await this.prisma.user.upsert({
      where: { id },
      update: {
        email,
        firstName: person.firstname,
        lastName: person.lastname,
        username: person.account.username,
      },
      create: {
        id,
        email,
        firstName: person.firstname,
        lastName: person.lastname,
        username: person.account.username,
      },
    });

    const guide = await this.prisma.guide.upsert({
      where: { id },
      update: { status: 'ACTIVE', phone },
      create: { id, phone },
      include: { user: true, languages: true, blockedPeriods: true },
    });

    this.logger.log(`Created guide ${id}`);
    return guide as ReadGuideDto;
  }

  async update(
    id: number,
    updateGuideDto: UpdateGuideDto,
  ): Promise<ReadGuideDto> {
    const { languageIds, ...rest } = updateGuideDto;

    if (languageIds) {
      const languages = await this.prisma.language.findMany({
        where: { id: { in: languageIds } },
      });

      const missingIds = languageIds.filter(
        (languageId) => !languages.some(({ id }) => id === languageId),
      );

      if (missingIds.length > 0) {
        const message = `No language found with id${missingIds.length === 1 ? '' : 's'} ${missingIds.join(', ')}`;
        this.logger.warn(message);
        throw new NotFoundException(message);
      }
    }

    try {
      const guide = await this.prisma.guide.update({
        where: { id },
        data: {
          ...rest,
          ...(languageIds && {
            languages: {
              set: languageIds.map((languageId) => ({ id: languageId })),
            },
          }),
        },
        include: { user: true, languages: true, blockedPeriods: true },
      });

      this.logger.log(`Updated guide ${id}`);
      return guide as ReadGuideDto;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        this.logger.warn(`No guide found with id ${id}`);
        throw new NotFoundException(`No guide found with id ${id}`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.guide.update({
        where: { id },
        data: { status: 'RETIRED' },
      });
      this.logger.log(`Removed guide ${id}`);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        this.logger.warn(`No guide found with id ${id}`);
        throw new NotFoundException(`No guide found with id ${id}`);
      }
      throw error;
    }
  }

  async findGuideForReservation(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { language: true },
    });

    if (!reservation) {
      throw new InternalServerErrorException();
    }

    const guides = await this.prisma.guide.findMany({
      where: {
        status: 'ACTIVE',
        languages: { some: { id: reservation?.language.id } },
        blockedPeriods: {
          none: {
            start: { lte: reservation?.date },
            end: { gte: reservation?.date },
          },
        },
        places: { some: { id: reservation?.placeId } },
      },
      select: { id: true },
    });

    return guides.map((g) => g.id);
  }
}
