import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTokenForUser(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Korisnik nije pronađen');
    }

    const token = randomBytes(32).toString('hex');
    user.refreshToken = token;
    await this.userRepository.save(user);
    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { refreshToken: token } });
    if (!user) {
      throw new NotFoundException('Token nije pronađen');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.refreshToken = null;
    await this.userRepository.save(user);
  }
}
