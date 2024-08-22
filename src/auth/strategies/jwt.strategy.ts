import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AllConfigType } from '../../config/config.types';
import * as dotenv from 'dotenv';
import { ERROR_MESSAGES } from '../../utils/constants/all-constants';
import { UserStatus } from '../../users/constants/user-status.enum';
dotenv.config();

type JwtPayload = {
  id: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService<AllConfigType>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth', { infer: true }).secret,
      ignoreExpiration: false,
    });
  }
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOneById(payload.id);

    if (user.status !== UserStatus.Active) {
      throw new ForbiddenException(ERROR_MESSAGES.DONT_HAVE_PERMISSION);
    }

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
