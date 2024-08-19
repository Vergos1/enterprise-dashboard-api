import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsRepository } from './repositories/questions.repository';
import { QuestionEntity } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionDto } from './dto/question.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionDto> {
    const category = await this.categoriesService.getCategoryById(
      createQuestionDto.categoryId,
    );
    const text = createQuestionDto.text;

    return this.questionsRepository.create({ category, text });
  }

  async getQuestion(id: string): Promise<QuestionEntity> {
    const questions = await this.questionsRepository.getById(id);
    if (!questions) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }
    return questions;
  }

  async updateQuestion(
    id: string,
    updateQuestionDto: Partial<QuestionEntity>,
  ): Promise<QuestionDto> {
    const question = await this.getQuestion(id);
    const updatedQuestion = await this.questionsRepository.update(
      question.id,
      updateQuestionDto,
    );
    return updatedQuestion;
  }

  async deleteQuestion(id: string): Promise<void> {
    const question = await this.getQuestion(id);
    await this.questionsRepository.deleteQuestion(question.id);
  }
}
