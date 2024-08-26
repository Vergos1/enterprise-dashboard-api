import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from '../utils/constants/all-constants';
import { UserStatus } from 'src/users/constants/user-status.enum';
import { AuthResDto } from './dto/auth-res.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: AuthDto): Promise<AuthResDto> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    if (user.status !== UserStatus.Active) {
      throw new ForbiddenException(ERROR_MESSAGES.DONT_HAVE_PERMISSION);
    }
    if (await bcrypt.compare(password, user.password)) {
      const hasAdminRole = await this.rolesService.userHasAdminRole(user.id);
      if (!hasAdminRole) {
        throw new ForbiddenException(ERROR_MESSAGES.DONT_HAVE_PERMISSION);
      }
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      };

      const shortUserInfo = await this.usersService.getUserShortInfoById(
        user.id,
      );
      const response = new AuthResDto();
      response.token = this.jwtService.sign(payload);
      response.user = shortUserInfo;

      return response;
    }
    throw new UnauthorizedException(ERROR_MESSAGES.INVALID_PASSWORD);
  }
}
