import { IsNumber, IsString, IsDate } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
	readonly userId: number;

  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly email: string;

	@IsDate()
	readonly createdAt: Date;
}