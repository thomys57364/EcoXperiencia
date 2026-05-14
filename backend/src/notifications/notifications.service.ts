import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notification, NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    usuarioId: string;
    tipo: NotificationType;
    titulo: string;
    mensaje: string;
    urlAccion?: string;
  }): Promise<Notification> {
    return this.prisma.notification.create({ data });
  }

  async getNotifications(usuarioId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { usuarioId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadNotifications(usuarioId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { usuarioId, leido: false },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: { leido: true },
    });
  }

  async markAllAsRead(usuarioId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { usuarioId, leido: false },
      data: { leido: true },
    });
  }

  async delete(id: string): Promise<Notification> {
    return this.prisma.notification.delete({ where: { id } });
  }
}
