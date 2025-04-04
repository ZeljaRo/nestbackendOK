import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChangePasswordService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<{ message: string }> {
    // 🔐 Pronađi korisnika po ID-u
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Korisnik nije pronađen');
    }

    // 🔐 Provjera stare lozinke
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Stara lozinka nije točna');
    }

    // 🔐 Hashiranje nove lozinke
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // 💾 Spremanje nove lozinke
    await this.userRepository.save(user);

    return { message: '✅ Lozinka je uspješno promijenjena' };
  }
}
