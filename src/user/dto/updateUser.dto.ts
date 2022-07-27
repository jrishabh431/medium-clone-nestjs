import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  readonly username: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  readonly password: string;

  @IsOptional()
  readonly image: string;

  @IsOptional()
  readonly bio: string;
}
