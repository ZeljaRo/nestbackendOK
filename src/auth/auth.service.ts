import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async register(userData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userService.create({
      ...userData,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(userData: { email: string; password: string }) {
    const user = await this.userService.findByEmail(userData.email);
    if (!user || !(await bcrypt.compare(userData.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.cacheManager.set(
      `user_${user.id}_refresh`,
      tokens.refreshToken,
      7 * 24 * 60 * 60 * 1000,
    );

    return tokens;
  }

  async generateTokens(userId: number, email: string) {
    const payload = { id: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async validateRefreshToken(userId: number, token: string): Promise<boolean> {
    const storedToken = await this.cacheManager.get<string>(`user_${userId}_refresh`);
    return storedToken === token;
  }

  async generateAccessToken(userId: number): Promise<string> {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('Korisnik ne postoji');

    return this.jwtService.sign({ id: user.id, email: user.email }, { expiresIn: '1h' });
  }
}
