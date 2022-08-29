import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/utils/JoiValidationPipe';
import { UsersService } from './users.service';
import { IUserRegister } from './users.types';
import { userRegisterSchema } from './users.validation';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  @HttpCode(201)
  async register(
    @Body(new JoiValidationPipe(userRegisterSchema)) data: IUserRegister,
  ) {
    try {
      return this.usersService.register(data);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
