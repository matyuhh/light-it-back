import {
  Controller,
  InternalServerErrorException,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('/login')
  async login(@Request() req, @Response() res) {
    try {
      const user = await this.authService.login(req.user);
      const { access_token, ...rest } = user;
      res.cookie('access_token', access_token);
      return res.send(rest);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
