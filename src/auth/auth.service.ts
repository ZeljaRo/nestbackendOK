import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userService.create({
      email: data.email,
      password: hashedPassword,
    });
    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Korisnik ne postoji');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Neispravna lozinka');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // ✅ Spremi refresh token u bazu
    await this.userService.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    return { accessToken: newAccessToken };
  }
}
