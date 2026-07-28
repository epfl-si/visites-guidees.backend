import { VisitService } from './visit.service';
import { places } from '../../../generated/prisma/client';
import { placeAndLanguage } from '../../types/Place';
import { Controller, Get, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
import { form } from '../../types/Form';

@Controller('api/')
export class VisitController {
  constructor(private readonly appService: VisitService) { }

  @Get()
  getToursInfo(): Promise<places[] | null> {
    return this.appService.getToursInfo();
  }

  @Get(':id/details')
  getVisitDetails(@Param('id', ParseIntPipe) id: number): Promise<placeAndLanguage> {
    return this.appService.getTourDetails(id);
  }

  @Post('visit/register')
  Register(@Body() content: { "data": form }) {
    return this.appService.register(content.data)
  }

} 