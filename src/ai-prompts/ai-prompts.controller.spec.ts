import { Test, TestingModule } from '@nestjs/testing';
import { AiPromptsController } from './ai-prompts.controller';

describe('AipromptsController', () => {
  let controller: AiPromptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiPromptsController],
    }).compile();

    controller = module.get<AiPromptsController>(AiPromptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
