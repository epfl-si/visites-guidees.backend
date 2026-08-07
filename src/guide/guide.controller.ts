import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { GuideService } from './guide.service';
import { AzureAdGuard } from '../auth/azure-ad-auth.guard';
import { GroupsGuard } from '../guards/groups.guard';
import { RequireGroups } from '../decorators/require-groups.decorator';
import { CreateGuideDto } from './dto/create-guide.dto';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) { }

  @Get()
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('guided-tours-admin_AppGrpU')
  findAll() {
    return this.guideService.findAll();
  }

  @Post('add')
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('guided-tours-admin_AppGrpU')
  add(@Body() content: CreateGuideDto) {
    return this.guideService.add(content.sciper);
  }
}
