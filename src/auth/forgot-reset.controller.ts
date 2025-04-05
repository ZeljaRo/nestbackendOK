import { Controller, Post, Body } from '@nestjs/common';
import { ResetPasswordService } from '../user/reset-password.service';
import { ForgotPasswordService } from '../user/forgot-password.service';
import { ForgotPasswordDto } from '../user/dto/forgot-password.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';

@Controller('auth')
export class ForgotResetController {
  constructor(
    private readonly resetPasswordService: ResetPasswordService,
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  @Post('forgot-reset-password')
  async forgot(@Body() body: ForgotPasswordDto) {
    const { email } = body;
    const token = await this.resetPasswordService.createTokenForUser(email);
    await this.forgotPasswordService.saveResetToken(email, token);
    return { message: '✅ Token za reset lozinke je generiran i spremljen' };
  }

  @Post('reset')
  async reset(@Body() body: ResetPasswordDto) {
    const { token, newPassword } = body;
    await this.resetPasswordService.resetPassword(token, newPassword);
    return { message: '✅ Lozinka je uspješno resetirana' };
  }
}
