import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UuidParamDto } from './dto/uuid-param.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({ description: 'Return all categories', type: [CategoryDto] })
  async getCategories(): Promise<CategoryDto[]> {
    return await this.categoriesService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved category.',
    type: [CategoryDto],
  })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  async getCategoryById(
    @Param(ValidationPipe) params: UuidParamDto,
  ): Promise<CategoryDto> {
    return this.categoriesService.getCategoryById(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({
    description: 'The category has been successfully created.',
    type: [CategoryDto],
  })
  @ApiNotFoundResponse({ description: 'Parent category not found.' })
  async createCategory(
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiOkResponse({
    description: 'Successfully updated category.',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  async updateCategory(
    @Param(ValidationPipe) params: UuidParamDto,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoriesService.updateCategory(params.id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiOkResponse({ description: 'Category deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  async deleteCategory(
    @Param(ValidationPipe) params: UuidParamDto,
  ): Promise<void> {
    return this.categoriesService.deleteCategory(params.id);
  }
}
