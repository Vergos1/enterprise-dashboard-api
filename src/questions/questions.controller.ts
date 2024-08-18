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
import { UuidParamDto } from '../categories/dto/uuid-param.dto';
import { QuestionsService } from './questions.service';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

//   @Get()
//   @ApiOperation({ summary: 'Get all' })
//   @ApiOkResponse({ description: 'Return all', type: [CategoryDto] })
//   async getCategories(): Promise<CategoryDto[]> {
//     return await this.categoriesService.getCategories();
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Get category by ID' })
//   @ApiOkResponse({
//     description: 'Successfully retrieved category.',
//     type: [CategoryDto],
//   })
//   @ApiNotFoundResponse({ description: 'Category not found.' })
//   async getCategoryById(
//     @Param(ValidationPipe) params: UuidParamDto,
//   ): Promise<CategoryDto> {
//     return this.categoriesService.getCategoryById(params.id);
//   }

//   @Post()
//   @ApiOperation({ summary: 'Create a new category' })
//   @ApiCreatedResponse({
//     description: 'The category has been successfully created.',
//     type: [CategoryDto],
//   })
//   @ApiNotFoundResponse({ description: 'Parent category not found.' })
//   async createCategory(
//     @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
//   ): Promise<CategoryDto> {
//     return this.categoriesService.createCategory(createCategoryDto);
//   }

//   @Put(':id')
//   @ApiOperation({ summary: 'Update category' })
//   @ApiOkResponse({
//     description: 'Successfully updated category.',
//     type: CategoryDto,
//   })
//   @ApiNotFoundResponse({ description: 'Category not found.' })
//   async updateCategory(
//     @Param(ValidationPipe) params: UuidParamDto,
//     @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
//   ): Promise<CategoryDto> {
//     return this.categoriesService.updateCategory(params.id, updateCategoryDto);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete question' })
//   @ApiOkResponse({ description: 'Question deleted successfully.' })
//   @ApiNotFoundResponse({ description: 'Question not found.' })
//   async deleteCategory(
//     @Param(ValidationPipe) params: UuidParamDto,
//   ): Promise<void> {
//     return this.categoriesService.deleteCategory(params.id);
//   }
}
