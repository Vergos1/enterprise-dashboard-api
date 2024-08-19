import {
  Controller,
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
import { QuestionDto } from './dto/question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new question' })
  @ApiCreatedResponse({
    description: 'The question has been successfully created.',
    type: [QuestionDto],
  })
  @ApiNotFoundResponse({ description: 'Parent category not found.' })
  async createCategory(
    @Body(ValidationPipe) createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionDto> {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiOkResponse({
    description: 'Successfully updated category.',
    type: QuestionDto,
  })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  async updateCategory(
    @Param(ValidationPipe) params: UuidParamDto,
    @Body(ValidationPipe) updatQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionDto> {
    return this.questionsService.updateQuestion(params.id, updatQuestionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete question' })
  @ApiOkResponse({ description: 'Question deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Question not found.' })
  async deleteCategory(
    @Param(ValidationPipe) params: UuidParamDto,
  ): Promise<void> {
    return this.questionsService.deleteQuestion(params.id);
  }
}
