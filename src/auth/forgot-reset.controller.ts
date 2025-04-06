import { UseGuards } from '@nestjs/common';
import { ThrottleGuard } from './throttle.guard';
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from '../user/dto/forgot-password.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';
import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';

@Controller('auth')
export class ForgotResetController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('forgot-reset-password')
@UseGuards(ThrottleGuard)
async forgotResetPassword(@Body() forgotDto: ForgotPasswordDto) {

    const { email } = forgotDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      return { message: '❌ Korisnik s ovim emailom ne postoji' };
    }

    const token = this.jwtService.sign(
      { email: user.email },
      { secret: 'tajniResetKljuc', expiresIn: '1s' },
    );

    await this.userService.saveResetToken(user.email, token);
    this.mailService.sendResetEmail(email, token);

    return { message: '✅ Token za reset lozinke je generiran i poslan e-mailom' };
  }

  @Post('reset')
  async resetPassword(@Body() resetDto: ResetPasswordDto) {
    const { token, newPassword } = resetDto;

    // ⏳ Provjera je li token istekao
    if (this.tokenService.isExpired(token)) {
      return { message: '❌ Token je istekao' };
    }

    try {
      const payload = this.jwtService.verify(token, { secret: 'tajniResetKljuc' });
      const user = await this.userService.findByEmail(payload.email);

      if (!user || user.refreshToken !== token) {
        return { message: '❌ Token nije valjan ili je već iskorišten' };
      }

      await this.userService.updatePassword(user.email, newPassword);
      await this.userService.saveResetToken(user.email, null);

      return { message: '✅ Lozinka je uspješno resetirana' };
    } catch (error) {
      return { message: '❌ Token je neispravan' };
    }
  }
}
