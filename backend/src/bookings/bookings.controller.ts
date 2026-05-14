import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  async findAll(
    @Query('usuarioId') usuarioId?: string,
    @Query('experienciaId') experienciaId?: string,
    @Query('estado') estado?: string
  ) {
    return this.bookingsService.findAll({
      usuarioId,
      experienciaId,
      estado: estado as any,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Post()
  async create(@Body() createBookingDto: any) {
    return this.bookingsService.create(createBookingDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBookingDto: any) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @Body() data?: { razon?: string }) {
    return this.bookingsService.cancel(id, data?.razon);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }
}
