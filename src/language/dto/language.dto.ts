import { IsNumber, IsString } from 'class-validator';

export class LanguageDto {
  @IsString()
  name!: string;

  @IsNumber()
  id!: number;

  @IsString()
  code!: string;
}
