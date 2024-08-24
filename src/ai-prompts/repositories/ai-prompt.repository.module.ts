import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiPromptEntity } from '../entities/ai-prompt.entity';
import { AiPromptsRepository } from './ai-prompt.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AiPromptEntity])],
  providers: [AiPromptsRepository],
  exports: [AiPromptsRepository],
})
export class AiPromptsRepositoryModule {}
