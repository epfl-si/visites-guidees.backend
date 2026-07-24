import { AppService } from './app.service';
import { places } from '../generated/prisma/client';
import { placeAndLanguage } from './types/Place';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('tours')
  getToursInfo(): Promise<places[] | null> {
    return this.appService.getToursInfo();
  }

  @Get('tour/:id/details')
  getTourDetails(@Param('id', ParseIntPipe) id: number): Promise<placeAndLanguage> {
    return this.appService.getTourDetails(id);
  }
} 