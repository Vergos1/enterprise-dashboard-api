import { Module } from '@nestjs/common';
import { AiPromptsController } from './ai-prompts.controller';
import { AiPromptsService } from './ai-prompts.service';

import { AiPromptsRepositoryModule } from './repositories/ai-prompt.repository.module';

@Module({
  imports: [AiPromptsRepositoryModule],
  controllers: [AiPromptsController],
  providers: [AiPromptsService],
})
export class AiPromptsModule {}
