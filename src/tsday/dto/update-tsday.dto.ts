import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class UpdateTsdayDto {

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(10)
  darpamins: number

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(10)
  nondarpamins: number

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(10)
  sickmins: number

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(10)
  ptomins: number

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(10)
  holidaymins: number
}