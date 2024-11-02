import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = {
  username: string,
  password: string,
  email: string
};

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      email: 'a@gmail.com'
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      email: 'b@gmail.com'
    },
  ];

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    const existingEmail = await this.findByEmail(email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }
    const newUser = { userId: Date.now(), username, password, email };
    this.users.push(newUser);
    return newUser;
  }
}
