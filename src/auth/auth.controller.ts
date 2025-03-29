import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    return this.authService.register(userData);
  }

  @Post('login')
  async login(@Body() userData: { email: string; password: string }) {
    return this.authService.login(userData);
  }

  @UseGuards(JwtAuthGuard)  // ✅ OVO OSIGURAVA AUTORIZACIJU!
  @Get('profile')
  async getProfile(@Request() req) {
    return { message: 'Access granted!', user: req.user };
  }
}
