import { Controller, Get } from '@nestjs/common';
import { LanguageService } from './language.service';

@Controller({ path: 'languages', version: '1' })
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  findAll() {
    return this.languageService.findAll();
  }
}
