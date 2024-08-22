import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import {
  Post,
  Param,
  UseGuards,
  Controller,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.quard';
import { ERROR_MESSAGES } from 'src/utils/constants/all-constants';
import { UuidParamDto } from 'src/categories/dto/uuid-param.dto';

@ApiTags('Admin Roles Management')
@Controller('roles')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('assign-admin-role-to/:id')
  @ApiOperation({ summary: 'Assign admin role to user' })
  @ApiResponse({
    status: 201,
    description: 'Admin role assigned to user',
  })
  @ApiNotFoundResponse({ description: ERROR_MESSAGES.USER_NOT_FOUND })
  async assignRole(
    @Param(new ValidationPipe({ transform: true })) params: UuidParamDto,
  ) {
    return await this.rolesService.assignAdminRole(params.id);
  }

  @Post('remove-admin-role-for/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove admin role for user' })
  @ApiResponse({
    status: 201,
    description: 'Admin role removed for user',
  })
  @ApiNotFoundResponse({ description: ERROR_MESSAGES.USER_NOT_FOUND })
  async removeRole(
    @Param(new ValidationPipe({ transform: true })) params: UuidParamDto,
  ) {
    return await this.rolesService.removeAdminRole(params.id);
  }
}
