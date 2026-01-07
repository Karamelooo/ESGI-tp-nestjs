import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('movies')
@Controller('movies')
@ApiBearerAuth()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Crée un film (admin)' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Liste tous les films (public)' })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtiens un film par id (public)' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprime un film (admin)' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
