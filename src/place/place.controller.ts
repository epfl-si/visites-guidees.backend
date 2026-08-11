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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create.dto';
import { UpdatePlaceDto } from './dto/update.dto';
import { ResponsePlaceDto, ResponsePlaceListDto } from './dto/response.dto';
import { AzureAdGuard } from '../auth/azure-ad-auth.guard';
import { GroupsGuard } from '../guards/groups.guard';
import { RequireGroups } from '../decorators/require-groups.decorator';

@Controller({ path: 'places', version: '1' })
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  @ApiResponse({ type: [ResponsePlaceListDto] })
  list(): Promise<ResponsePlaceListDto[]> {
    return this.placeService.list();
  }

  @Get(':id')
  @ApiResponse({ type: ResponsePlaceDto })
  read(@Param('id', ParseIntPipe) id: number): Promise<ResponsePlaceDto> {
    return this.placeService.read(id);
  }

  @Post()
  @ApiResponse({ type: ResponsePlaceDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  create(@Body() createPlaceDto: CreatePlaceDto): Promise<ResponsePlaceDto> {
    return this.placeService.create(createPlaceDto);
  }

  @Patch(':id')
  @ApiResponse({ type: ResponsePlaceDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ): Promise<ResponsePlaceDto> {
    return this.placeService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.placeService.remove(id);
  }
}
