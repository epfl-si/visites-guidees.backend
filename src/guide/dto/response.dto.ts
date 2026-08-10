import { IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { LanguageDto } from '../../language/dto/language.dto';

export class ResponseGuidesDto {
  @IsNumber()
  sciper!: number;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  email!: string;

  @IsArray()
  @ValidateNested({ each: true })
  phone!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  languages!: LanguageDto[];

  @IsString()
  status!: string;
}

export class ResponseCreationGuide {

  @IsNumber()
  sciper!: number;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;
}