import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const isUserPasswordCorrect = await compare(pass, user?.hash);
    if (user && isUserPasswordCorrect) {
      const { hash, createdAt, updatedAt, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const { _id, username, year_of_birth, gender } = user;
    const payload = { _id, username };
    return {
      access_token: this.jwtService.sign(payload),
      _id,
      gender,
      year_of_birth,
    };
  }
}
