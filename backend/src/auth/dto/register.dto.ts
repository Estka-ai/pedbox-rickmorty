import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@pedbox.dev' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SuperSecret123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
