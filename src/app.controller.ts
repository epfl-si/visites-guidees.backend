import { Controller, Get, Options } from '@nestjs/common';
import { AppService } from './app.service';
import { UseGuards, Req } from '@nestjs/common';
import { AzureAdGuard } from './auth/azure-ad-auth.guard';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AzureAdGuard)
  @Get('protected')
  getProtected(@Req() req) {
    console.log('User info:', req.user);
    return { user: req.user };
  }
} 