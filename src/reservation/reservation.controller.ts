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
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateReservationDto } from './dto/create.dto';
import { UpdateReservationDto } from './dto/update.dto';
import { ResponseReservationDto } from './dto/response.dto';
import { AzureAdGuard } from '../auth/azure-ad-auth.guard';
import { GroupsGuard } from '../guards/groups.guard';
import { RequireGroups } from '../decorators/require-groups.decorator';

@Controller({ path: 'reservations', version: '1' })
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('/register')
  Register(@Body() content: CreateReservationDto) {
    return this.reservationService.register(content);
  }

  @Get('/last')
  GetLast() {
    return this.reservationService.getLastReservations();
  }

  @Get()
  @ApiResponse({ type: [ResponseReservationDto] })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  list(): Promise<ResponseReservationDto[]> {
    return this.reservationService.list();
  }

  @Get(':id')
  @ApiResponse({ type: ResponseReservationDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  read(@Param('id', ParseIntPipe) id: number): Promise<ResponseReservationDto> {
    return this.reservationService.read(id);
  }

  @Patch(':id')
  @ApiResponse({ type: ResponseReservationDto })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups('visites-guidees-admins_AppGrpU')
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<ResponseReservationDto> {
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
