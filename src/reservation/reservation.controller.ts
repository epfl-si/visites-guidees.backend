import { ReservationService } from './reservation.service';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('api/reservation')
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
}
