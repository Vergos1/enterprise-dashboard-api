import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { QuestionEntity } from '../entities/question.entity';
import {
  PaginationOptionsDTO,
  PaginatedEntity,
  PageMetaData,
} from '../../common/pagination/pagination.options';

@Injectable()
export class QuestionsRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionEntityRepository: Repository<QuestionEntity>,
  ) {}
  async getByCategoryId(
    categoryId: string,
    paginationOptions: PaginationOptionsDTO,
  ): Promise<PaginatedEntity<QuestionEntity>> {
    const queryBuilder = this.questionEntityRepository
      .createQueryBuilder('question')
      .where('question.categoryId = :categoryId', { categoryId })
      .skip(paginationOptions.skip)
      .take(paginationOptions.limit)
      .orderBy('question.id', paginationOptions.order);

    const itemCount = await queryBuilder.getCount();
    const items = await queryBuilder.getMany();
    const pageMatadata = new PageMetaData({
      itemCount,
      paginationOptionsDTO: paginationOptions,
    });

    return new PaginatedEntity<QuestionEntity>(items, pageMatadata);
  }
  async getThreeRandomQuestions(): Promise<QuestionEntity[]> {
    return await this.questionEntityRepository
      .createQueryBuilder('question')
      .orderBy('RANDOM()')
      .take(3)
      .getMany();
  }

  async getById(id: string): Promise<QuestionEntity> {
    return await this.questionEntityRepository
      .createQueryBuilder('question')
      .where('question.id = :id', { id })
      .getOne();
  }
}
