import { Controller, Get, Post, Body, Param, Put, Delete, Logger } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  private logger = new Logger('CategoriesController');

  constructor(private categoriesService: CategoriesService) {
    this.logger.log('CategoriesController initialized');
  }

  @Get()
  async findAll() {
    try {
      this.logger.log('findAll() called');
      const result = await this.categoriesService.findAll();
      this.logger.log(`findAll() returned ${result.length} categories`);
      return result;
    } catch (error) {
      this.logger.error(`findAll() error: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      this.logger.log(`findOne() called with id: ${id}`);
      const result = await this.categoriesService.findOne(id);
      this.logger.log(`findOne() returned category with id: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`findOne() error: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post()
  async create(@Body() createCategoryDto: any) {
    try {
      this.logger.log(`create() called with: ${JSON.stringify(createCategoryDto)}`);
      const result = await this.categoriesService.create(createCategoryDto);
      this.logger.log(`create() returned new category with id: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`create() error: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: any) {
    try {
      this.logger.log(`update() called with id: ${id} and data: ${JSON.stringify(updateCategoryDto)}`);
      const result = await this.categoriesService.update(id, updateCategoryDto);
      this.logger.log(`update() returned updated category with id: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`update() error: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      this.logger.log(`delete() called with id: ${id}`);
      const result = await this.categoriesService.delete(id);
      this.logger.log(`delete() returned deleted category with id: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`delete() error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
