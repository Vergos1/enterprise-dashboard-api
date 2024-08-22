import {
  Controller,
  UseGuards,
  Get,
  Post,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  ValidationPipe,
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
import { JwtGuard } from 'src/auth/guards/jwt.quard';

@ApiTags('Admin User Management')
@Controller('users')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Search and filter users' })
  @ApiOkResponse({
    description: 'Get filtered users list',
    type: [UserInListDto],
  })
  async getUsers(
    @Query(ValidationPipe) query: GetUsersDto,
  ): Promise<UserInListDto[]> {
    return this.usersService.getUsers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ description: 'Get user by id', type: UserInfoDto })
  async getUserById(@Param('id') id: string): Promise<UserInfoDto> {
    return this.usersService.gelUserInfoById(id);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export filtered users to CSV' })
  async exportUsersToCsv(
    @Query(ValidationPipe) query: GetUsersDto,
  ): Promise<string> {
    return await this.usersService.exportUsersToCsv(query);
  }

  @Post('status/:id')
  @ApiOperation({ summary: 'Block/unblock user' })
  @ApiCreatedResponse({ description: 'User blocked/unblocked successful' })
  async changeUserStatus(@Param('id') id: string): Promise<void> {
    return this.usersService.blockOrUnblockUser(id);
  }
}
