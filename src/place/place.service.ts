import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma.service';
import { CreatePlaceDto } from './dto/create.dto';
import { UpdatePlaceDto } from './dto/update.dto';
import { ResponsePlaceDto, ResponsePlaceListDto } from './dto/response.dto';
import { AppLogger as Logger } from '@/logger.service';

@Injectable()
export class PlaceService {
  private readonly logger = new Logger(PlaceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<ResponsePlaceListDto[]> {
    const places = await this.prisma.place.findMany();

    if (places.length === 0) {
      this.logger.warn('No place found');
      throw new NotFoundException('No place found');
    }

    this.logger.log(`Listed ${places.length} place(s)`);
    return places as ResponsePlaceListDto[];
  }

  async read(id: number): Promise<ResponsePlaceDto> {
    const place = await this.prisma.place.findUnique({
      where: { id },
      include: { languages: true },
    });

    if (!place) {
      this.logger.warn(`No place found with id ${id}`);
      throw new NotFoundException(`No place found with id ${id}`);
    }

    if (place.languages.length === 0) {
      this.logger.error(`Place ${id} has no associated languages`);
      throw new Error(`Place ${id} has no associated languages`);
    }

    this.logger.log(`Read place ${id}`);
    return place as ResponsePlaceDto;
  }

  async create(createPlaceDto: CreatePlaceDto): Promise<ResponsePlaceDto> {
    const place = await this.prisma.place.create({
      data: {
        title: createPlaceDto.title,
        picture: createPlaceDto.picture,
        description: createPlaceDto.description,
        capacity: createPlaceDto.capacity,
        price: createPlaceDto.price,
        conditions: createPlaceDto.conditions,
        languages: {
          connect: createPlaceDto.languageIds.map((id) => ({ id })),
        },
      },
      include: { languages: true },
    });

    this.logger.log(`Created place ${place.id}`);
    return place as ResponsePlaceDto;
  }

  async update(
    id: number,
    updatePlaceDto: UpdatePlaceDto,
  ): Promise<ResponsePlaceDto> {
    const { languageIds, ...rest } = updatePlaceDto;

    try {
      const place = await this.prisma.place.update({
        where: { id },
        data: {
          ...rest,
          ...(languageIds && {
            languages: {
              set: languageIds.map((languageId) => ({ id: languageId })),
            },
          }),
        },
        include: { languages: true },
      });

      this.logger.log(`Updated place ${id}`);
      return place as ResponsePlaceDto;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        this.logger.warn(`No place found with id ${id}`);
        throw new NotFoundException(`No place found with id ${id}`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.place.delete({ where: { id } });
      this.logger.log(`Removed place ${id}`);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        this.logger.warn(`No place found with id ${id}`);
        throw new NotFoundException(`No place found with id ${id}`);
      }
      throw error;
    }
  }
}
