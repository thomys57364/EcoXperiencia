import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Experience, ExperienceStatus } from '@prisma/client';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    anfitrionId: string;
    titulo: string;
    slug: string;
    descripcion: string;
    ubicacionTexto: string;
    precioBase: number;
    duracionHoras: number;
    maxPersonas: number;
    categoriaId?: string;
    subcategoria?: string;
    latitud?: number;
    longitud?: number;
    minPersonas?: number;
    incluye?: any;
    noIncluye?: any;
    requisitos?: any;
    puntoEncuentro?: string;
  }): Promise<Experience> {
    return this.prisma.experience.create({
      data: {
        ...data,
        precioBase: new Decimal(data.precioBase),
      },
      include: { categoria: true },
    });
  }

  async findAll(filters?: {
    categoriaId?: string;
    estado?: ExperienceStatus;
    skip?: number;
    take?: number;
  }): Promise<Experience[]> {
    return this.prisma.experience.findMany({
      where: {
        ...(filters?.categoriaId && { categoriaId: filters.categoriaId }),
        ...(filters?.estado && { estado: filters.estado }),
        estado: 'ACTIVA',
      },
      include: {
        categoria: true,
        imagenes: { where: { esPortada: true } },
        anfitrion: { include: { usuario: true } },
      },
      skip: filters?.skip || 0,
      take: filters?.take || 10,
    });
  }

  async findOne(id: string): Promise<Experience | null> {
    return this.prisma.experience.findUnique({
      where: { id },
      include: {
        categoria: true,
        imagenes: true,
        anfitrion: { include: { usuario: true } },
        favoritos: true,
        reseñas: { include: { usuario: true } },
      },
    });
  }

  async findBySlug(slug: string): Promise<Experience | null> {
    return this.prisma.experience.findUnique({
      where: { slug },
      include: {
        categoria: true,
        imagenes: true,
        anfitrion: { include: { usuario: true } },
      },
    });
  }

  async findByAnfitrion(anfitrionId: string): Promise<Experience[]> {
    return this.prisma.experience.findMany({
      where: { anfitrionId },
      include: { categoria: true, imagenes: true },
    });
  }

  async update(id: string, data: any): Promise<Experience> {
    return this.prisma.experience.update({
      where: { id },
      data,
      include: { categoria: true },
    });
  }

  async delete(id: string): Promise<Experience> {
    return this.prisma.experience.delete({
      where: { id },
    });
  }

  async addImage(
    experienciaId: string,
    data: { url: string; titulo?: string; esPortada?: boolean; orden?: number }
  ) {
    return this.prisma.experienceImage.create({
      data: {
        experienciaId,
        ...data,
      },
    });
  }
}

import { Decimal } from '@prisma/client/runtime/library';
