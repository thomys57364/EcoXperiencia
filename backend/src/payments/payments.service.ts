import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Payment, PaymentStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    bookingId: string;
    usuarioId: string;
    monto: number;
    metodo: PaymentMethod;
    estado?: PaymentStatus;
  }): Promise<Payment> {
    return this.prisma.payment.create({
      data,
      include: { booking: true, usuario: true },
    });
  }

  async findAll(filters?: { usuarioId?: string; estado?: PaymentStatus }) {
    return this.prisma.payment.findMany({
      where: filters,
      include: { booking: true, usuario: true },
    });
  }

  async findOne(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { booking: true },
    });
  }

  async updateStatus(id: string, estado: PaymentStatus, transactionId?: string) {
    return this.prisma.payment.update({
      where: { id },
      data: { estado, transactionId },
    });
  }
}
