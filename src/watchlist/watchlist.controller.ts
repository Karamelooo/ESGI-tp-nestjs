import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WatchlistService } from './watchlist.service';
import { AddToWatchlistDto } from './dto/add-to-watchlist.dto';
import { OwnershipGuard } from '../auth/guards/ownership.guard';

@ApiTags('watchlist')
@Controller('watchlist')
@ApiBearerAuth()
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: 'Ajoute un film à la liste' })
  add(@Body() dto: AddToWatchlistDto) {
    return this.watchlistService.add(dto);
  }

  @Get(':userId')
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: 'Obtiens la liste de l’utilisateur' })
  findAll(@Param('userId') userId: string) {
    return this.watchlistService.findAllByUser(+userId);
  }

  @Delete(':userId/:movieId')
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: 'Retire un film de la liste' })
  remove(@Param('userId') userId: string, @Param('movieId') movieId: string) {
    return this.watchlistService.remove(+userId, +movieId);
  }
}
