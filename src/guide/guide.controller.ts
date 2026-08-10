import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GuideService } from './guide.service';
import { CreateGuideDto } from './dto/create.dto';
import { ResponseGuideDto } from './dto/response.dto';
import { AzureAdGuard } from '../auth/azure-ad-auth.guard';
import { GroupsGuard } from '../guards/groups.guard';
import { RequireGroups } from '../decorators/require-groups.decorator';

@Controller({ path: 'guides', version: '1' })
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Get()
  @ApiResponse({ type: [ResponseGuideDto] })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('guided-tours-admin_AppGrpU')
  @ApiBearerAuth('access-token')
  list(): Promise<ResponseGuideDto[]> {
    return this.guideService.list();
  }

  @Post()
  @ApiResponse({ type: ResponseGuideDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('guided-tours-admin_AppGrpU')
  @ApiBearerAuth('access-token')
  create(@Body() createGuideDto: CreateGuideDto): Promise<ResponseGuideDto> {
    return this.guideService.create(createGuideDto);
  }
}
