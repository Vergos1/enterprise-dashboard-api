import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from '../entities/question.entity';
import { QuestionsRepository } from './questions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity])],
  providers: [QuestionsRepository],
  exports: [QuestionsRepository],
})
export class QuestionsRepositoryModule {}
