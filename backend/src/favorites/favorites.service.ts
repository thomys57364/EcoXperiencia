import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Favorite } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(
    usuarioId: string,
    experienciaId: string
  ): Promise<Favorite> {
    return this.prisma.favorite.create({
      data: { usuarioId, experienciaId },
    });
  }

  async removeFavorite(usuarioId: string, experienciaId: string): Promise<void> {
    await this.prisma.favorite.deleteMany({
      where: { usuarioId, experienciaId },
    });
  }

  async getFavorites(usuarioId: string): Promise<Favorite[]> {
    return this.prisma.favorite.findMany({
      where: { usuarioId },
      include: { experiencia: true },
      orderBy: { fechaAgregado: 'desc' },
    });
  }

  async isFavorite(usuarioId: string, experienciaId: string): Promise<boolean> {
    const fav = await this.prisma.favorite.findUnique({
      where: {
        usuarioId_experienciaId: { usuarioId, experienciaId },
      },
    });
    return !!fav;
  }
}
