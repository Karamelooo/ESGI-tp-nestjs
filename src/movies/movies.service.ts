import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.movie.findMany();
  }

  async findOne(id: number) {
    return this.prisma.movie.findUnique({
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
