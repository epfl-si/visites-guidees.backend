import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  code!: string;
}
