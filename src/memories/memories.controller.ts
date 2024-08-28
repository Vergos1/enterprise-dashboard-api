import {
  Controller,
  Post,
  Param,
  ValidationPipe,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.quard';
import { UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { MemoriesService } from './memories.service';
import { SetStatusDto } from './dto/set-status.dto';
import { GetMemoriesDto } from './dto/get-memories.dto';
import { MemoryInListDto } from './dto/memory-in-list.dto';
import {
  PaginatedList,
  CreatePaginatedDto,
} from '../pagination/pagination.options';
import { ERROR_MESSAGES } from 'src/utils/constants/all-constants';

const PaginatedMemoriesDto = CreatePaginatedDto(
  MemoryInListDto,
  'PaginatedMemoriesDto',
);

@ApiTags('Content Moderation')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('memories')
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all memories' })
  @ApiOkResponse({
    description: 'Get all memories',
    type: [PaginatedMemoriesDto],
  })
  async getAllMemories(
    @Query() query: GetMemoriesDto,
  ): Promise<PaginatedList<MemoryInListDto>> {
    return this.memoriesService.getMemories(query);
  }

  @Post('status/:id')
  @ApiOperation({ summary: 'Change memory status' })
  @ApiCreatedResponse({ description: 'Memory status change is successful' })
  @ApiNotFoundResponse({ description: ERROR_MESSAGES.MEMORY_NOT_FOUND })
  async changeMemoryStatus(
    @Param('id') id: string,
    @Body(ValidationPipe) setStatusDto: SetStatusDto,
  ): Promise<void> {
    return this.memoriesService.changeStatus(id, setStatusDto.status);
  }
}
