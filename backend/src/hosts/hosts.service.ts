import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Host, VerificationStatus, DocumentType } from '@prisma/client';

@Injectable()
export class HostsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    usuarioId: string;
    documentoTipo: DocumentType;
    documentoNumero: string;
    fechaNacimiento: Date;
    direccionCompleta: string;
    ciudad: string;
    departamento: string;
    pais?: string;
    biografiaAnfitrion?: string;
  }): Promise<Host> {
    return this.prisma.host.create({
      data,
      include: { usuario: true },
    });
  }

  async findAll(): Promise<Host[]> {
    return this.prisma.host.findMany({
      include: { usuario: true, experiencias: true },
    });
  }

  async findOne(id: string): Promise<Host | null> {
    return this.prisma.host.findUnique({
      where: { id },
      include: { usuario: true, experiencias: true },
    });
  }

  async findByUsuarioId(usuarioId: string): Promise<Host | null> {
    return this.prisma.host.findUnique({
      where: { usuarioId },
      include: { usuario: true, experiencias: true },
    });
  }

  async update(
    id: string,
    data: any
  ): Promise<Host> {
    return this.prisma.host.update({
      where: { id },
      data,
      include: { usuario: true },
    });
  }

  async verify(
    id: string,
    estado: VerificationStatus
  ): Promise<Host> {
    return this.prisma.host.update({
      where: { id },
      data: {
        estadoVerificacion: estado,
        fechaVerificacion: estado === 'VERIFICADO' ? new Date() : null,
      },
    });
  }

  async delete(id: string): Promise<Host> {
    return this.prisma.host.delete({ where: { id } });
  }
}
