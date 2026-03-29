import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './users.service';
import { LoginDto } from './login.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() loginDto: LoginDto) {
    return await this.usersService.login(loginDto);
  }
}
