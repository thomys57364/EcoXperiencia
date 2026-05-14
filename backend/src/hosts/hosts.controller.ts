import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { HostsService } from './hosts.service';

@Controller('hosts')
export class HostsController {
  constructor(private hostsService: HostsService) {}

  @Get()
  async findAll() {
    return this.hostsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.hostsService.findOne(id);
  }

  @Post()
  async create(@Body() createHostDto: any) {
    return this.hostsService.create(createHostDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateHostDto: any) {
    return this.hostsService.update(id, updateHostDto);
  }

  @Post(':id/verify')
  async verify(@Param('id') id: string, @Body() data: { estado: string }) {
    return this.hostsService.verify(id, data.estado as any);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.hostsService.delete(id);
  }
}
