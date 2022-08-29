import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserModel } from 'src/schemas/users';
import errorCodes from 'src/utils/errorCodes';
import { IUserRegister } from './users.types';

export type User = any;

@Injectable()
export class UsersService {
  async register(data: IUserRegister) {
    const {
      username,
      password,
      confirmPassword,
      year_of_birth,
      gender,
      name,
      surname,
    } = data;

    const userExists = await UserModel.findOne({ username });
    if (userExists)
      throw new BadRequestException(errorCodes.USER_ALREADY_EXISTS);
    if (password !== confirmPassword)
      throw new BadRequestException(errorCodes.PASSWORD_DOESNT_MATCH);

    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    const user = {
      username,
      name,
      surname,
      year_of_birth,
      gender,
    };

    await new UserModel({ ...user, hash: hashedPassword }).save();
    return { user };
  }

  async findOne(username: string): Promise<User | undefined> {
    try {
      const user = UserModel.findOne({ username }).lean();
      return user;
    } catch (err) {
      return null;
    }
  }
}
