import {
  Controller,
  UseGuards,
  Get,
  Post,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetUsersDto } from './dto/getUsers.dto';
import { UserInListDto } from './dto/userInList.dto';
import { UserInfoDto } from './dto/userInfo.dto';
import { JwtGuard } from '../auth/guards/jwt.quard';
import { PaginatedList } from '../pagination/pagination.options';
import { CreatePaginatedDto } from '../pagination/pagination.options';
import { Response } from 'express';
import { User } from '../common/user.decorator';
import { UserDto } from './dto/user.dto';

const PaginatedUsersDto = CreatePaginatedDto(
  UserInListDto,
  'PaginatedUsersResponseDto',
);

@ApiTags('Admin User Management')
@Controller('users')
// @UseGuards(JwtGuard)
// @ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Search and filter users' })
  @ApiOkResponse({
    description: 'Get filtered users list',
    type: PaginatedUsersDto,
  })
  async getUsers(
    @User() user: UserDto,
    @Query() query: GetUsersDto,
  ): Promise<PaginatedList<UserInListDto>> {
    return this.usersService.getUsers(query, user.id);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export filtered users to CSV' })
  @ApiOkResponse({
    description: 'CSV file of filtered users',
  })
  async exportUsersToCsv(
    @Query() query: GetUsersDto,
    @Res() res: Response,
  ): Promise<void> {
    const csvContent = await this.usersService.exportUsersToCsv(query);
    res.header('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csvContent);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ description: 'Get user by id', type: UserInfoDto })
  async getUserById(@Param('id') id: string): Promise<UserInfoDto> {
    return this.usersService.getUserInfoById(id);
  }

  @Post('status/:id')
  @ApiOperation({ summary: 'Block/unblock user' })
  @ApiCreatedResponse({ description: 'User blocked/unblocked successful' })
  async changeUserStatus(@Param('id') id: string): Promise<void> {
    return this.usersService.blockOrUnblockUser(id);
  }
}
