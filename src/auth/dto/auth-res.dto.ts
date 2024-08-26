import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ShortUserInfoDto {
  @ApiProperty({ description: 'The first name of the user', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'example@example.com',
  })
  @IsEmail()
  email: string;
}

export class AuthResDto {
  @ApiProperty({
    description: 'The JWT token to be used for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsIn........',
  })
  token: string;

  @ApiProperty({
    description: 'The user information',
    type: ShortUserInfoDto,
  })
  user: ShortUserInfoDto;
}
