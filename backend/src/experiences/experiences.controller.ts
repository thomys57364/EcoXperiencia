import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';

@Controller('experiences')
export class ExperiencesController {
  constructor(private experiencesService: ExperiencesService) {}

  @Get()
  async findAll(
    @Query('categoriaId') categoriaId?: string,
    @Query('estado') estado?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string
  ) {
    return this.experiencesService.findAll({
      categoriaId,
      estado: estado as any,
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 10,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.experiencesService.findBySlug(slug);
  }

  @Post()
  async create(@Body() createExperienceDto: any) {
    return this.experiencesService.create(createExperienceDto);
  }

  @Post(':id/images')
  async addImage(@Param('id') id: string, @Body() imageData: any) {
    return this.experiencesService.addImage(id, imageData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateExperienceDto: any) {
    return this.experiencesService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.experiencesService.delete(id);
  }
}
