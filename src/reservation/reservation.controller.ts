import { ReservationService } from './reservation.service';
import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  ParseEnumPipe,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateReservationDto } from './dto/create.dto';
import { UpdateReservationDto } from './dto/update.dto';
import { ListReservationDto } from './dto/list.dto';
import { ReadReservationDto } from './dto/read.dto';
import { Prisma } from '../../generated/prisma/client';
import { AzureAdGuard } from '../auth/azure-ad-auth.guard';
import { GroupsGuard } from '../guards/groups.guard';
import { RequireGroups } from '../decorators/require-groups.decorator';

@Controller({ path: 'reservations', version: '1' })
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @ApiResponse({ type: [ListReservationDto] })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  list(
    @Query('order', new ParseEnumPipe(Prisma.SortOrder, { optional: true }))
    order?: Prisma.SortOrder,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<ListReservationDto[]> {
    return this.reservationService.list(order, limit);
  }

  @Get(':id')
  @ApiResponse({ type: ReadReservationDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  read(@Param('id', ParseIntPipe) id: number): Promise<ReadReservationDto> {
    return this.reservationService.read(id);
  }

  @Post()
  @ApiResponse({ type: ReadReservationDto })
  create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<ReadReservationDto> {
    return this.reservationService.create(createReservationDto);
  }

  @Patch(':id')
  @ApiResponse({ type: ReadReservationDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<ReadReservationDto> {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.reservationService.remove(id);
  }
}
