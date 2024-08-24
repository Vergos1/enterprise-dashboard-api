import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiPromptEntity } from '../entities/ai-prompt.entity';
import { CreateAiPromptDto } from '../dto/create-ai-prompt.dto';
import { UpdateAiPromptDto } from '../dto/update-ai-prompt.dto';
import { PromptType } from '../constants/prompt-type.enun';

export class AiPromptsRepository {
  constructor(
    @InjectRepository(AiPromptEntity)
    private readonly aiPromptsRepository: Repository<AiPromptEntity>,
  ) {}

  async create(createAiPromptDto: CreateAiPromptDto): Promise<AiPromptEntity> {
    const newPrompt = this.aiPromptsRepository.create(createAiPromptDto);
    return await this.aiPromptsRepository.save(newPrompt);
  }

  async findAll(): Promise<AiPromptEntity[]> {
    return await this.aiPromptsRepository.find();
  }

  async findOneById(id: string): Promise<AiPromptEntity | null> {
    return await this.aiPromptsRepository.findOne({ where: { id } });
  }

  async findOneByType(type: PromptType): Promise<AiPromptEntity | null> {
    return await this.aiPromptsRepository.findOne({ where: { type } });
  }

  async update(
    id: string,
    updateAiPromptDto: UpdateAiPromptDto,
  ): Promise<AiPromptEntity> {
    const prompt = await this.findOneById(id);
    if (prompt) {
      Object.assign(prompt, updateAiPromptDto);
      return await this.aiPromptsRepository.save(prompt);
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const prompt = await this.findOneById(id);
    if (prompt) {
      await this.aiPromptsRepository.remove(prompt);
      return true;
    }
    return false;
  }

  async checkIfPromptExists(type: PromptType): Promise<boolean> {
    return this.aiPromptsRepository.count({ where: { type } }).then((count) => {
      return count > 0;
    });
  }
}
