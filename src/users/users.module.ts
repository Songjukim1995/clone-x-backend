import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './users.controller'; // UserController로 수정
import { UserService } from './users.service'; // UserService로 수정
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secretKey', // 테스트용 비밀키
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController], // UserController로 수정
  providers: [UserService], // UserService로 수정
})
export class UsersModule {}
