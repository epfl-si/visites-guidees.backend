import { Injectable } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PrismaService } from '../prisma.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ResponsePlaceDto,
  ResponsePlaceWithoutLanguagesDto,
} from './dto/response-place.dto';

@Injectable()
export class PlaceService {
  constructor(private prisma: PrismaService) {}

  async getPlaceInfo(): Promise<ResponsePlaceWithoutLanguagesDto[] | null> {
    const places = await this.prisma.places.findMany();

    if (places.length == 0) {
      throw new NotFoundException(`No place found `);
    }

    return places as ResponsePlaceWithoutLanguagesDto[];
  }

  async getPlaceDetails(id: number): Promise<ResponsePlaceDto | null> {
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
      languages: languages,
    } as ResponsePlaceDto;
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
