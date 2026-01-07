import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddToWatchlistDto {
  @ApiProperty()
  @IsNumber()
  movieId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
