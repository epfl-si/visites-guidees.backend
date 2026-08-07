import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  guideInfo,
  guideLanguage,
  languages,
  status,
  Users,
} from '../../generated/prisma/client';
import { ResponseCreationGuide, ResponseGuidesDto } from './dto/response-guide.dto';
import { LanguageDto } from '../language/dto/language.dto';
import { callEPFLApi } from '../lib/api';
import { ResponseFromEPFLApiSpecific } from '../types/user';


@Injectable()
export class GuideService {
  constructor(private prisma: PrismaService) { }

  flattenGuideInfo(
    obj: guideInfo & { user: Users } & {
      guideLanguages: (guideLanguage & { language: languages })[];
    } & { status: status },
  ): ResponseGuidesDto {
    const { user, guideLanguages, status, ...guide } = obj;
    console.log(guideLanguages)
    const languages: LanguageDto[] = guideLanguages.map(item => item.language);

    return { ...guide, ...user, ...status, languages };
  }

  async findAll(): Promise<ResponseGuidesDto[]> {
    console.log('find')
    const guides = await this.prisma.guideInfo.findMany({
      include: {
        user: true,
        guideLanguages: {
          include: { language: true },
        },
        status: true,
      },
    });

    console.log(guides)

    return guides.map((guide) => this.flattenGuideInfo(guide));
  }

  async add(sciper: number): Promise<ResponseCreationGuide> {

    const user = await callEPFLApi<ResponseFromEPFLApiSpecific>(`v1/persons/${sciper}`)

    if (user == null) {
      throw new NotFoundException()
    }

    await this.prisma.users.upsert({
      where: { sciper: Number(user.id) },
      update: { email: user.email, firstName: user.firstname, lastName: user.lastname, gaspar: user.account.username },
      create: { sciper: Number(user.id), email: user.email, firstName: user.firstname, lastName: user.lastname, gaspar: user.account.username },
    })

    const phones: string[] = []

    for (const phone of user.phones) {
      phones.push(phone.number)
    }

    await this.prisma.guideInfo.upsert({
      where: { sciper: Number(user.id) },
      update: {},
      create: { sciper: Number(user.id), statusId: 6, phone: phones },
    })

    return {
      "sciper": Number(user.id),
      "firstName": user.firstname,
      "lastName": user.lastname
    }
  }
}
