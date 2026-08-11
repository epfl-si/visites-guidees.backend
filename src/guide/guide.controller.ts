import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GuideService } from './guide.service';
import { CreateGuideDto } from './dto/create.dto';
import { UpdateGuideDto } from './dto/update.dto';
import { ListGuideDto } from './dto/list.dto';
import { ReadGuideDto } from './dto/read.dto';
import { AzureAdGuard } from '../auth/azure-ad-auth.guard';
import { GroupsGuard } from '../guards/groups.guard';
import { RequireGroups } from '../decorators/require-groups.decorator';

@Controller({ path: 'guides', version: '1' })
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Get()
  @ApiResponse({ type: [ListGuideDto] })
  @UseGuards(AzureAdGuard)
  @ApiBearerAuth('access-token')
  list(): Promise<ListGuideDto[]> {
    return this.guideService.list();
  }

  @Get(':id')
  @ApiResponse({ type: ReadGuideDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  read(@Param('id', ParseIntPipe) id: number): Promise<ReadGuideDto> {
    return this.guideService.read(id);
  }

  @Post()
  @ApiResponse({ type: ReadGuideDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  create(@Body() createGuideDto: CreateGuideDto): Promise<ReadGuideDto> {
    return this.guideService.create(createGuideDto);
  }

  @Patch(':id')
  @ApiResponse({ type: ReadGuideDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGuideDto: UpdateGuideDto,
  ): Promise<ReadGuideDto> {
    return this.guideService.update(id, updateGuideDto);
  }

  @Delete(':id')
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.guideService.remove(id);
  }
}
