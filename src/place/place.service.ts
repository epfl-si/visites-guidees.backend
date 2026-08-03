import { Injectable } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { placeAndLanguage } from '../types/place';
import { PrismaService } from '../prisma.service';
import { places } from '../../generated/prisma/client';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class PlaceService {
  constructor(private prisma: PrismaService) {}

  getPlaceInfo(): Promise<places[] | null> {
    return this.prisma.places.findMany();
  }

  async getPlaceDetails(id: number): Promise<placeAndLanguage> {
    const place = await this.prisma.places.findUnique({
      where: { id },
      include: {
        placeLanguages: {
          include: {
            language: true,
          },
        },
      },
    });

    if (!place) {
      throw new NotFoundException(`No place found with id ${id}`);
    }

    const { placeLanguages, ...placeWithoutLanguages } = place;

    const languages = placeLanguages.map((pl) => ({
      id: pl.language.id,
      name: pl.language.name,
    }));

    if (languages.length === 0) {
      throw new InternalServerErrorException(
        `No languages found for place with id ${id}`,
      );
    }

    return {
      ...placeWithoutLanguages,
      Languages: languages,
    };
  }

  create(createPlaceDto: CreatePlaceDto) {
    return this.prisma.places.create({
      data: {
        title: createPlaceDto.title,
        picture: createPlaceDto.picture,
        description: createPlaceDto.description,
        maxPerGroup: createPlaceDto.maxPerGroup,
        price: createPlaceDto.price,
        conditions: createPlaceDto.conditions,
        placeLanguages: {
          create: createPlaceDto.languageIds.map((languageId) => ({
            languageId,
          })),
        },
      },
    });
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return this.prisma.places.update({
      where: { id },
      data: updatePlaceDto,
    });
  }

  // TODO : Implement the remove method to delete a place by its ID
}
