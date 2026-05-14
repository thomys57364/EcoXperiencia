import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  async findAll(
    @Query('usuarioId') usuarioId?: string,
    @Query('estado') estado?: string
  ) {
    return this.paymentsService.findAll({
      usuarioId,
      estado: estado as any,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  async create(@Body() createPaymentDto: any) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: { estado: string; transactionId?: string }
  ) {
    return this.paymentsService.updateStatus(id, data.estado as any, data.transactionId);
  }
}
