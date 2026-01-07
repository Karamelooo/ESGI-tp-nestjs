import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToWatchlistDto } from './dto/add-to-watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

  async add(dto: AddToWatchlistDto) {
    try {
      return await this.prisma.watchlistItem.create({
        data: {
          userId: dto.userId,
          movieId: dto.movieId,
        },
      });
    } catch (e) {
      throw new BadRequestException('Film déjà dans la liste ou identifiants invalides');
    }
  }

  async findAllByUser(userId: number) {
    return this.prisma.watchlistItem.findMany({
      where: { userId },
      include: { movie: true },
    });
  }

  async remove(userId: number, movieId: number) {
    return this.prisma.watchlistItem.delete({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });
  }
}
