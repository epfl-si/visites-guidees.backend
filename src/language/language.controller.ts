import {
  Controller,
  Get,
  ParseIntPipe,
  UseGuards,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { LanguageService } from './language.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LanguageDto } from './dto/language.dto';
import { AzureAdGuard } from '@/auth/azure-ad-auth.guard';
import { GroupsGuard } from '@/guards/groups.guard';
import { RequireGroups } from '@/decorators/require-groups.decorator';
import { adminGroup } from '@/constant/auth';
import { CreateLanguageDto } from '@/language/dto/create.dto';
import { UpdateLanguageDto } from './dto/update.dto';

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
  @ApiResponse({ type: LanguageDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups(adminGroup)
  @ApiBearerAuth('access-token')
  findById(@Param('id', ParseIntPipe) id: number): Promise<LanguageDto> {
    return this.languageService.read(id);
  }

  @Post()
  @ApiResponse({ type: LanguageDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups(adminGroup)
  @ApiBearerAuth('access-token')
  create(@Body() createLanguageDto: CreateLanguageDto): Promise<LanguageDto> {
    return this.languageService.create(createLanguageDto);
  }

  @Post(':id/restore')
  @ApiResponse({ type: LanguageDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups(adminGroup)
  @ApiBearerAuth('access-token')
  restore(@Param('id', ParseIntPipe) id: number): Promise<LanguageDto> {
    return this.languageService.restore(id);
  }

  @Put(':id')
  @ApiResponse({ type: LanguageDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups(adminGroup)
  @ApiBearerAuth('access-token')
  modify(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ): Promise<LanguageDto> {
    return this.languageService.modify(id, updateLanguageDto);
  }

  @Delete(':id')
  @ApiResponse({ type: LanguageDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups(adminGroup)
  @ApiBearerAuth('access-token')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.languageService.remove(id);
  }
}
