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
import { places } from '../../generated/prisma/client';
import { placeAndLanguage } from '../types/place';
import { UseGuards } from '@nestjs/common';
import { AzureAdGuard } from '../auth/azure-ad-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('api/place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  getPlaceInfo(): Promise<places[] | null> {
    return this.placeService.getPlaceInfo();
  }

  @Get(':id')
  getPlaceDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<placeAndLanguage> {
    return this.placeService.getPlaceDetails(id);
  }

  @Post()
  @UseGuards(AzureAdGuard)
  @ApiBearerAuth('access-token')
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placeService.create(createPlaceDto);
  }

  @Patch(':id')
  @UseGuards(AzureAdGuard)
  @ApiBearerAuth('access-token')
  update(@Param('id') id: number, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(+id, updatePlaceDto);
  }
}
