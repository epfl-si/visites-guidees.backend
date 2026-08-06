import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  guideInfo,
  guideLanguage,
  languages,
  status,
  Users,
} from '../../generated/prisma/client';
import { ResponseGuidesDto } from './dto/response-guide.dto';
import { LanguageDto } from '../language/dto/language.dto';

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
    const guides = await this.prisma.guideInfo.findMany({
      include: {
        user: true,
        guideLanguages: {
          include: { language: true },
        },
        status: true,
      },
    });

    return guides.map((guide) => this.flattenGuideInfo(guide));
  }
}
