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
  ParseIntPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.quard';
import { ERROR_MESSAGES } from 'src/utils/constants/all-constants';

@ApiTags('Admin Roles Management')
@Controller('roles')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('assign-admin-role-to/:userId')
  @ApiOperation({ summary: 'Assign admin role to user' })
  @ApiResponse({
    status: 201,
    description: 'Admin role assigned to user',
  })
  @ApiNotFoundResponse({ description: ERROR_MESSAGES.USER_NOT_FOUND })
  async assignRole(@Param('userId', ParseIntPipe) id: string) {
    return await this.rolesService.assignAdminRole(id);
  }

  @Post('remove-admin-role-for/:userId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove admin role for user' })
  @ApiResponse({
    status: 201,
    description: 'Admin role removed for user',
  })
  @ApiNotFoundResponse({ description: ERROR_MESSAGES.USER_NOT_FOUND })
  async removeRole(@Param('userId', ParseIntPipe) id: string) {
    return await this.rolesService.removeAdminRole(id);
  }
}
