import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    experienciaId: string;
    usuarioId: string;
    bookingId: string;
    calificacion: number;
    comentario: string;
    titulo?: string;
    calificacionLimpieza?: number;
    calificacionValor?: number;
    calificacionExperiencia?: number;
  }): Promise<Review> {
    return this.prisma.review.create({
      data,
      include: { usuario: true, experiencia: true },
    });
  }

  async findByExperiencia(experienciaId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { experienciaId, visible: true },
      include: { usuario: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUsuario(usuarioId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { usuarioId },
      include: { experiencia: true },
    });
  }

  async addHostResponse(id: string, respuesta: string): Promise<Review> {
    return this.prisma.review.update({
      where: { id },
      data: {
        respuestaAnfitrion: respuesta,
        fechaRespuesta: new Date(),
      },
    });
  }

  async getAverageRating(experienciaId: string): Promise<number> {
    const result = await this.prisma.review.aggregate({
      where: { experienciaId },
      _avg: { calificacion: true },
    });
    return result._avg.calificacion || 0;
  }
}
