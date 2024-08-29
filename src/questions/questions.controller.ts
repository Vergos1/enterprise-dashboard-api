import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  Param,
  Put,
  Delete,
  Res,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UuidParamDto } from '../categories/dto/uuid-param.dto';
import { QuestionsService } from './questions.service';
import { QuestionDto } from './dto/question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.quard';
import { Response } from 'express';

@ApiTags('Questions')
@Controller('questions')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('export/:categoryId')
  @ApiOperation({
    summary: 'Export inspiration questions to CSV by category ID',
  })
  @ApiOkResponse({
    description: 'CSV file of inspiration questions',
  })
  async exportQuestionsToCsv(
    @Param('categoryId') categoryId: string,
    @Res() res: Response,
  ): Promise<void> {
    const csvContent =
      await this.questionsService.exportQuestionsToCsv(categoryId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="questions_${categoryId}.csv"`,
    );
    res.send(csvContent);
  }

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
  @ApiOperation({ summary: 'Update question' })
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
