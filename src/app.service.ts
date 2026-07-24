import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClient, places } from '../generated/prisma/client';
import { placeAndLanguage } from './types/Place';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }
  getHello(): string {
    return 'Hello World!';
  }


  getToursInfo(): Promise<places[] | null> {
    return this.prisma.places.findMany();
  }

  async getTourDetails(id: number): Promise<placeAndLanguage> {
    const place = await this.prisma.places.findUnique({
      where: { id },
      include: {
        placeLanguages: {
          include: {
            language: true
          }
        }
      }
    });

    if (!place) {
      throw new NotFoundException(`No place found with id ${id}`);
    }

    const { placeLanguages, ...placeWithoutLanguages } = place;
    const languages: string[] = placeLanguages.map(pl => pl.language.name);

    if (languages.length === 0) {
      throw new InternalServerErrorException(`No languages found for place with id ${id}`);
    }

    return {
      ...placeWithoutLanguages,
      Languages: languages
    };
  }
}
