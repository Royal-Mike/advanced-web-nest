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

  async register(username: string, email: string, password: string): Promise<User> {
    if (!username || !email || !password) {
      throw new BadRequestException("Invalid data");
    }

    try {
      const user = await this.usersService.createUser(username, email, password);
      return user;
    } catch (e) {
      throw new ConflictException(e.message);
    }
  }
}
