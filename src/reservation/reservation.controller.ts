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
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateReservationDto } from './dto/create.dto';
import { UpdateReservationDto } from './dto/update.dto';
import { ListReservationDto } from './dto/list.dto';
import { ReadReservationDto } from './dto/read.dto';
import { Prisma } from '../../generated/prisma/client';
import { AzureAdGuard } from '../auth/azure-ad-auth.guard';
import { GroupsGuard } from '../guards/groups.guard';
import { GuideGuard } from '../guards/guide.guard';
import { RequireGroups } from '../decorators/require-groups.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ReqEntraOauthUser } from '../types/auth';
import { ReservationGuideAction } from './reservation-guide-action.enum';
import { GuideInvitationDto } from './dto/guide-invitation.dto';
import { adminGroup } from '@/constant/auth';

@Controller({ path: 'reservations', version: '1' })
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @Get()
  @ApiResponse({ type: [ListReservationDto] })
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups(adminGroup)
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
  @ApiBearerAuth('access-token')
  read(@Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: ReqEntraOauthUser,
  ): Promise<ReadReservationDto> {
    return this.reservationService.read(id, user);
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
  @RequireGroups(adminGroup)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<ReadReservationDto> {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Get(':id/invitation')
  @ApiResponse({ type: GuideInvitationDto })
  @UseGuards(AzureAdGuard, GuideGuard)
  @ApiBearerAuth('access-token')
  getGuideInvitation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: ReqEntraOauthUser,
  ): Promise<GuideInvitationDto> {
    return this.reservationService.getGuideInvitation(
      id,
      Number(user.uniqueid),
    );
  }

  @Post(':id/:action')
  @ApiParam({ name: 'action', enum: ReservationGuideAction })
  @UseGuards(AzureAdGuard, GuideGuard)
  @ApiBearerAuth('access-token')
  respond(
    @Param('id', ParseIntPipe) id: number,
    @Param('action', new ParseEnumPipe(ReservationGuideAction))
    action: ReservationGuideAction,
    @CurrentUser() user: ReqEntraOauthUser,
  ): Promise<void> {
    return this.reservationService.respondToInvitation(
      id,
      action,
      Number(user.uniqueid),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AzureAdGuard, GroupsGuard)
  @RequireGroups(adminGroup)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.reservationService.remove(id);
  }
}
