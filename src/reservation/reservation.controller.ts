import { ReservationService } from './reservation.service';
import { Controller, Post, Body } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly appService: ReservationService) {}

  @Post('/register')
  Register(@Body() content: CreateReservationDto) {
    return this.appService.register(content);
  }
}
