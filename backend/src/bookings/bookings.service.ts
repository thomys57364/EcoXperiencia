import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Booking, BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    experienciaId: string;
    usuarioId: string;
    fechaExperiencia: Date;
    horario: string;
    personas: number;
    precioUnitario: number;
    precioTotal: number;
    notasUsuario?: string;
  }): Promise<Booking> {
    // Generar código de confirmación
    const codigoConfirmacion = this.generarCodigoConfirmacion();
    
    return this.prisma.booking.create({
      data: {
        ...data,
        codigoConfirmacion,
      },
      include: { experiencia: true, usuario: true },
    });
  }

  async findAll(filters?: {
    usuarioId?: string;
    experienciaId?: string;
    estado?: BookingStatus;
  }): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: {
        ...(filters?.usuarioId && { usuarioId: filters.usuarioId }),
        ...(filters?.experienciaId && {
          experienciaId: filters.experienciaId,
        }),
        ...(filters?.estado && { estado: filters.estado }),
      },
      include: { experiencia: true, usuario: true },
    });
  }

  async findOne(id: string): Promise<Booking | null> {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { experiencia: true, usuario: true, pago: true },
    });
  }

  async update(id: string, data: Partial<Booking>): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data,
      include: { experiencia: true, usuario: true },
    });
  }

  async cancel(id: string, razon?: string): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data: {
        estado: 'CANCELADA',
        fechaCancelacion: new Date(),
        notasUsuario: razon,
      },
    });
  }

  private generarCodigoConfirmacion(): string {
    return 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}
