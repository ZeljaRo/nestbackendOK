import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { RolesGuard } from './roles.guard';
import { ForgotResetController } from './forgot-reset.controller';
import { ForgotPasswordDto } from '../user/dto/forgot-password.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({}), // konfiguracija JWT-a
  ],
  controllers: [
    AuthController,
    ForgotResetController, // ✅ samo ovaj controller koristimo za reset
  ],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    RolesGuard,
    MailService, // ✅ dummy email servis
  ],
  exports: [JwtModule], // omogućuje drugim modulima pristup JwtService
})
export class AuthModule {}
