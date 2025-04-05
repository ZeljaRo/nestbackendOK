import { Controller, Post, Body } from '@nestjs/common';
import { ForgotPasswordDto } from '../user/dto/forgot-password.dto';
import { ForgotPasswordService } from '../user/forgot-password.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class ForgotPasswordController {
  constructor(
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    // 🔐 Generiramo token koji traje 15 minuta
    const token = this.jwtService.sign({ email: dto.email }, { expiresIn: '15m' });

    // ✅ Spremamo token u bazu (u tablicu korisnika)
    await this.forgotPasswordService.saveResetToken(dto.email, token);

    // 📩 Ovdje bi inače išao email, ali za sada samo vraćamo token kao simulaciju
    return {
      message: '✅ Token za resetiranje poslan (simulacija)',
      token,
    };
  }
}
