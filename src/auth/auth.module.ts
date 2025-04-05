import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotResetController } from './forgot-reset.controller';
import { ForgotPasswordService } from '../user/forgot-password.service';
import { ResetPasswordService } from '../user/reset-password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({}), // ⬅️ neophodno za JwtService
  ],
  controllers: [
    AuthController,
    ForgotPasswordController,
    ForgotResetController,
  ],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    RolesGuard,
    ForgotPasswordService,
    ResetPasswordService,
  ],
  exports: [JwtModule], // ⬅️ omogućuje drugim modulima da koriste JwtService
})
export class AuthModule {}
