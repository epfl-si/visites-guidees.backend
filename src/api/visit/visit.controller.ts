import { VisitService } from './visit.service';
import { places } from '../../../generated/prisma/client';
import { placeAndLanguage } from '../../types/Place';
import { Controller, Get, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
@Controller()
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

} 