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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: AuthDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    if (await bcrypt.compare(password, user.password)) {
      const hasAdminRole = await this.rolesService.userHasAdminRole(user.id);
      if (!hasAdminRole) {
        throw new ForbiddenException(ERROR_MESSAGES.DONT_HAVE_PERMISSION);
      }
      delete user.password;
      return this.jwtService.sign(user);
    }
    throw new UnauthorizedException(ERROR_MESSAGES.INVALID_PASSWORD);
  }
}
