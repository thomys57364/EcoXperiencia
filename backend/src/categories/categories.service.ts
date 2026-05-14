import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  private logger = new Logger('CategoriesService');

  constructor(private prisma: PrismaService) {
    this.logger.log('CategoriesService initialized with PrismaService');
  }

  async create(data: {
    nombre: string;
    slug: string;
    icono: string;
    descripcion?: string;
    orden?: number;
  }): Promise<Category> {
    try {
      return await this.prisma.category.create({ data });
    } catch (error) {
      this.logger.error('Error creating category:', error);
      throw error;
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({
        where: { activa: true },
        orderBy: { orden: 'asc' },
      });
    } catch (error) {
      this.logger.error('Error finding categories:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Category | null> {
    try {
      return await this.prisma.category.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error('Error finding category:', error);
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { slug } });
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
}
