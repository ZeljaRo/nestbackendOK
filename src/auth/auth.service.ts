import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // REGISTRACIJA
  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  // LOGIN
  async login(data: { email: string; password: string }) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // GENERIRAJ TOKENE
  async generateTokens(userId: number, email: string, role: string) {
    const payload = { id: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // REFRESH TOKEN
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('User not found or no token saved');

    const isMatch = refreshToken === user.refreshToken;
    if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // GET ME
  async getMe(user: any) {
    return {
      message: '✅ Podaci iz tokena',
      user,
    };
  }

  // LOGOUT
  async logout(userId: number) {
    await this.userService.removeRefreshToken(userId);
    return {
      message: '✅ Uspješno ste se odjavili',
    };
  }
}
