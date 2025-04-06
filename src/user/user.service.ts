import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Dohvati sve korisnike
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Dohvati korisnika po ID-u
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Dohvati korisnika po e-mail adresi
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Ažuriraj korisnika
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return (await this.findById(id)) as User;
  }

  // Ažuriraj refresh token
  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  // Ukloni refresh token (logout)
  async removeRefreshToken(userId: number): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  // Spremi korisnika (npr. s validiranim tokenom)
  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  // Spremi reset token (u refreshToken polje)
  async saveResetToken(email: string, token: string | null): Promise<void> {
    await this.userRepository.update({ email }, { refreshToken: token });
  }

  // Ažuriraj lozinku korisniku
  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update({ email }, { password: hashedPassword });
  }
// Stvori novog korisnika
async create(data: Partial<User>): Promise<User> {
  const user = this.userRepository.create(data);
  return this.userRepository.save(user);
}
}
