import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../token/token.module'; // ✅ Dodan ispravan import

import { ForgotResetController } from './forgot-reset.controller';
import { ChangePasswordController } from './change-password.controller';
import { ThrottleGuard } from './throttle.guard';

@Module({
  imports: [
    JwtModule.register({}),               // Omogućuje rad s JWT tokenima
    PassportModule,                       // Za autentifikaciju
    forwardRef(() => UserModule),         // Rješava kružne ovisnosti
    MailModule,                           // MailService dostupnost
    TokenModule,                          // ✅ TokenService sada dostupan
  ],
  controllers: [
    AuthController,
    ForgotResetController,
    ChangePasswordController,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    ThrottleGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
