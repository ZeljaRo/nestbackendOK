import { Controller, Post, Body } from '@nestjs/common';
import { ForgotPasswordService } from '../user/forgot-password.service';
import { ResetPasswordService } from '../user/reset-password.service';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class ForgotResetPasswordController {
  constructor(
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('forgot-reset-password')
  async forgotResetPassword(@Body() body: ResetPasswordDto) {
    const email = body.email;

    // ✅ Generiramo reset token
    const token = this.jwtService.sign({ email }, { expiresIn: '15m' });

    // ✅ Spremamo token korisniku
    await this.forgotPasswordService.saveResetToken(email, token);

    return {
      message: '✅ Token za resetiranje lozinke generiran i spremljen (simulacija)',
      token,
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; newPassword: string }) {
    const email = body.email;

    await this.resetPasswordService.resetPassword(email, body.newPassword);

    return {
      message: '✅ Lozinka uspješno resetirana',
    };
  }
}
