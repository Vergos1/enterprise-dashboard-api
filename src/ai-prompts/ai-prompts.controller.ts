import {
  Controller,
  UseGuards,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AiPromptsService } from './ai-prompts.service';
import { AiPromptDto } from './dto/ai-prompt.dto';
import { ERROR_MESSAGES } from 'src/utils/constants/all-constants';
import { GetAiPromptDto } from './dto/get-ai-prompt.dto';
import { UpdateAiPromptDto } from './dto/update-ai-prompt.dto';
import { CreateAiPromptDto } from './dto/create-ai-prompt.dto';
import { JwtGuard } from '../auth/guards/jwt.quard';

@ApiTags('AI Prompts management')
@Controller('aiprompts')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class AiPromptsController {
  constructor(private readonly aiPromptsService: AiPromptsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all AI prompts' })
  @ApiOkResponse({ description: 'Get all AI prompts', type: [AiPromptDto] })
  async getAllAiPrompts(): Promise<AiPromptDto[]> {
    return this.aiPromptsService.getAllAiPrompts();
  }

  @Get(':type')
  @ApiOperation({ summary: 'Get AI prompt by type' })
  @ApiOkResponse({ description: 'Get AI prompt by type', type: AiPromptDto })
  @ApiNotFoundResponse({ description: ERROR_MESSAGES.AI_PROMPT_NOT_FOUND })
  async getAiPromptByType(
    @Param(new ValidationPipe({ transform: true })) params: GetAiPromptDto,
  ): Promise<AiPromptDto> {
    return this.aiPromptsService.getAiPromptByType(params.type);
  }

  @Post()
  @ApiOperation({ summary: 'Create AI prompt by type' })
  @ApiCreatedResponse({ description: 'AI prompt created', type: AiPromptDto })
  @ApiForbiddenResponse({
    description: ERROR_MESSAGES.AI_PROMPT_ALREADY_EXISTS,
  })
  async createAiPrompt(
    @Body(ValidationPipe) createAiPromptDto: CreateAiPromptDto,
  ): Promise<AiPromptDto> {
    return this.aiPromptsService.createAiPrompt(createAiPromptDto);
  }

  @Patch(':type')
  @ApiOperation({ summary: 'Update AI prompt by type' })
  @ApiOkResponse({ description: 'AI prompt updated', type: AiPromptDto })
  @ApiNotFoundResponse({ description: ERROR_MESSAGES.AI_PROMPT_NOT_FOUND })
  async updateAiPrompt(
    @Param(ValidationPipe) params: GetAiPromptDto,
    @Body(ValidationPipe)
    updateAiPromptDto: UpdateAiPromptDto,
  ): Promise<AiPromptDto> {
    return this.aiPromptsService.updateAiPrompt(params.type, updateAiPromptDto);
  }

  @Delete(':type')
  @ApiOperation({ summary: 'Delete AI prompt by type' })
  @ApiOkResponse({ description: 'AI prompt deleted' })
  @ApiNotFoundResponse({ description: ERROR_MESSAGES.AI_PROMPT_NOT_FOUND })
  async deleteAiPrompt(
    @Param(new ValidationPipe({ transform: true })) params: GetAiPromptDto,
  ): Promise<boolean> {
    return this.aiPromptsService.deleteAiPrompt(params.type);
  }
}
