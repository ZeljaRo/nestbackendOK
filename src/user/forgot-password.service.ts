import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async saveResetToken(email: string, token: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Korisnik nije pronađen');
    }

    user.refreshToken = token;
    await this.userRepository.save(user);
  }

  async updatePasswordWithToken(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { refreshToken: token } });
    if (!user) {
      throw new NotFoundException('Token nije valjan');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.refreshToken = null; // Token se poništava nakon korištenja
    await this.userRepository.save(user);
  }
}
