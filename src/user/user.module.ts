import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module'; // ⚠️ koristi se u user.service?

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule), // ✅ circular dependency ako koristiš auth unutar user
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // ✅ obavezno ako koristiš iz auth.service
})
export class UserModule {}
