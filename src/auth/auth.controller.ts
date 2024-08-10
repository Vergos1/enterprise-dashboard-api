import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Req, UseGuards, Get } from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.quard';
import { Request } from 'express';
import { AuthDto } from './dto/auth.dto';
import {
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ERROR_MESSAGES } from '../utils/constants/all-constants';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get user status' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiResponse({ status: 200, description: 'Valid JWT' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  status() {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @UseGuards(LocalGuard)
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: 201,
    description: 'Returns the authenticated user JWT',
  })
  @ApiUnauthorizedResponse({ description: ERROR_MESSAGES.INVALID_PASSWORD })
  @ApiNotFoundResponse({ description: ERROR_MESSAGES.USER_NOT_FOUND })
  @ApiForbiddenResponse({ description: ERROR_MESSAGES.DONT_HAVE_PERMISSION })
  login(@Req() req: Request) {
    return req.user;
  }
}
