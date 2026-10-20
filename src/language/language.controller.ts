import {
  Controller,
  Get,
  ParseIntPipe,
  UseGuards,
  Param,
} from '@nestjs/common';
import { LanguageService } from './language.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LanguageDto } from './dto/language.dto';
import { AzureAdGuard } from '@/auth/azure-ad-auth.guard';
import { GroupsGuard } from '@/guards/groups.guard';
import { RequireGroups } from '@/decorators/require-groups.decorator';
import { adminGroup } from '@/constant/auth';

@Controller({ path: 'languages', version: '1' })
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @ApiResponse({ type: [LanguageDto] })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups(adminGroup)
  @ApiBearerAuth('access-token')
  findAll(): Promise<LanguageDto[]> {
    return this.languageService.list();
  }

  @Get(':id')
  @ApiResponse({ type: [LanguageDto] })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups(adminGroup)
  @ApiBearerAuth('access-token')
  findById(@Param('id', ParseIntPipe) id: number): Promise<LanguageDto> {
    return this.languageService.read(id);
  }
}
