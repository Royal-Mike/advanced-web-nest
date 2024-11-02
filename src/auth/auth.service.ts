import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(username: string, password: string): Promise<string> {
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

    // TODO: Generate a JWT and return it here
    // instead of the user object
    return "true";
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
