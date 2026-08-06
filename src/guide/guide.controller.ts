import { Controller, Get, UseGuards } from '@nestjs/common';
import { GuideService } from './guide.service';
import { AuthGuard } from '@nestjs/passport';
import { RequireGroups } from '../decorators/require-groups.decorator';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) { }

  @Get()
  @UseGuards(AuthGuard, RequireGroups)
  @RequireGroups('guided-tours-admin_AppGrpU')
  findAll() {
    return this.guideService.findAll();
  }
}
