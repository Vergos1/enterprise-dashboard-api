import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AiPromptDto } from './dto/ai-prompt.dto';
import { CreateAiPromptDto } from './dto/create-ai-prompt.dto';
import { AiPromptsRepository } from './repositories/ai-prompt.repository';
import { PromptType } from './constants/prompt-type.enun';
import { ERROR_MESSAGES } from 'src/utils/constants/all-constants';
import { UpdateAiPromptDto } from './dto/update-ai-prompt.dto';

@Injectable()
export class AiPromptsService {
  constructor(private readonly aiPromptsRepository: AiPromptsRepository) {}

  async createAiPrompt(
    createAiPromptDto: CreateAiPromptDto,
  ): Promise<AiPromptDto> {
    const checkIfPromptExists =
      await this.aiPromptsRepository.checkIfPromptExists(
        createAiPromptDto.type,
      );

    if (checkIfPromptExists) {
      throw new ForbiddenException(ERROR_MESSAGES.AI_PROMPT_ALREADY_EXISTS);
    }

    return this.aiPromptsRepository.create(createAiPromptDto);
  }

  async getAllAiPrompts(): Promise<AiPromptDto[]> {
    return this.aiPromptsRepository.findAll();
  }

  async getAiPromptByType(type: PromptType): Promise<AiPromptDto> {
    const prompt = await this.aiPromptsRepository.findOneByType(type);
    if (!prompt) {
      throw new NotFoundException(ERROR_MESSAGES.AI_PROMPT_NOT_FOUND);
    }
    return this.aiPromptsRepository.findOneByType(type);
  }

  async updateAiPrompt(
    type: PromptType,
    updateAiPromptDto: UpdateAiPromptDto,
  ): Promise<AiPromptDto> {
    const prompt = await this.getAiPromptByType(type);

    return this.aiPromptsRepository.update(prompt.id, updateAiPromptDto);
  }

  async deleteAiPrompt(type: PromptType): Promise<boolean> {
    const prompt = await this.getAiPromptByType(type);

    return this.aiPromptsRepository.delete(prompt.id);
  }
}
