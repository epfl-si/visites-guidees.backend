import { IsNumber, IsString, IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { LanguageDto } from '../../language/dto/language.dto';

export class ResponseUserDto {

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  gaspar!: string;

  @IsString()
  @IsOptional()
  image!: string;

  @IsBoolean()
  isGuide!: boolean;

  @IsBoolean()
  isAdmin!: boolean;

}

export class ResponseUserSearch {

  @IsNumber()
  sciper!: number

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

}