import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, password: string): Promise<{ access_token: string }> {
    if (!username || !password) {
      throw new BadRequestException("Invalid data");
    }

    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException("Username doesn't exist");
    }

    const checkPassword = await this.usersService.comparePasswords(password, user.password);
    if (!checkPassword) {
      throw new UnauthorizedException("Wrong passsword");
    }

    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(username: string, email: string, password: string): Promise<{username: string}> {
    if (!username || !email || !password) {
      throw new BadRequestException("Invalid data");
    }

    if (password.length < 8) {
      throw new BadRequestException("Password must have at least 8 characters");
    }
    if (password.search(/[a-z]/i) < 0) {
      throw new BadRequestException("Password must contain at least one letter");
    }
    if (password.search(/[0-9]/) < 0) {
      throw new BadRequestException("Password must contain at least one digit");
    }
    if (email.search(/\S+@\S+/) < 0) {
      throw new BadRequestException("Invalid email");
    }

    try {
      const name = await this.usersService.createUser(username, email, password);
      return { username: name };
    } catch (e) {
      throw new ConflictException(e.message);
    }
  }
}
