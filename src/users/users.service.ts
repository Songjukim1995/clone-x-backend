import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  getAllUser() {
    const users = this.usersRepository.find();
    console.log('Executed Query: SELECT * FROM users');
    return users;
  }

  getUserById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async createUser(user: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = { ...user, password: hashedPassword };
    return this.usersRepository.save(newUser);
  }

  async login(loginDto: LoginDto) {
    if (!loginDto.email) {
      throw new HttpException(
        'Email must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!loginDto.password) {
      throw new HttpException(
        'Password must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user && !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const payload = { id: user.id, email: user.email };
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      access_token: this.jwtService.sign(payload),
    };
  }
}
