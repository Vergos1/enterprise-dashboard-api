import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AllConfigType } from '../../config/config.types';
import * as dotenv from 'dotenv';
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
    const user = await this.usersService.findOne({ id: payload.id });

    if (!user) {
      throw new UnauthorizedException();
    }
    delete user.password;
    return user;
  }
}
