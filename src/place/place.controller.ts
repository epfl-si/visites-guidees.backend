import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { UseGuards } from '@nestjs/common';
import { AzureAdGuard } from '../auth/azure-ad-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GroupsGuard } from '../guards/groups.guard';
import { RequireGroups } from '../decorators/require-groups.decorator';
import {
  ResponsePlaceDto,
  ResponsePlaceWithoutLanguagesDto,
} from './dto/response-place.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('place')

export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  @ApiResponse({ type: [ResponsePlaceWithoutLanguagesDto] })
  getPlaceInfo(): Promise<ResponsePlaceWithoutLanguagesDto[] | null> {
    return this.placeService.getPlaceInfo();
  }

  @Get(':id')
  @ApiResponse({ type: ResponsePlaceDto })
  getPlaceDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponsePlaceDto | null> {
    return this.placeService.getPlaceDetails(id);
  }

  @Post()
  @ApiResponse({ type: [ResponsePlaceWithoutLanguagesDto] })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('guided-tours-admin_AppGrpU')

  @ApiBearerAuth('access-token')
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placeService.create(createPlaceDto);
  }

  @Patch(':id')
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('guided-tours-admin_AppGrpU')
  @ApiBearerAuth('access-token')
  update(@Param('id') id: number, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(+id, updatePlaceDto);
  }
}
