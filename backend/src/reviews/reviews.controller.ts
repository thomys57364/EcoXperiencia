import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  async create(@Body() createReviewDto: any) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get('experiencia/:experienciaId')
  async findByExperiencia(@Param('experienciaId') experienciaId: string) {
    return this.reviewsService.findByExperiencia(experienciaId);
  }

  @Get('usuario/:usuarioId')
  async findByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.reviewsService.findByUsuario(usuarioId);
  }

  @Get('experiencia/:experienciaId/rating')
  async getAverageRating(@Param('experienciaId') experienciaId: string) {
    const rating = await this.reviewsService.getAverageRating(experienciaId);
    return { experienciaId, calificacionPromedio: rating };
  }

  @Put(':id/respuesta')
  async addHostResponse(
    @Param('id') id: string,
    @Body() data: { respuesta: string }
  ) {
    return this.reviewsService.addHostResponse(id, data.respuesta);
  }
}
