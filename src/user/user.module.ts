import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module'; // ⬅️ dodano

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule, // ⬅️ dodano da se može koristiti JwtService (i guardovi ako treba)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
