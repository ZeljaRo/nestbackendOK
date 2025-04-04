import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // STVARANJE NOVOG KORISNIKA
  async create(data: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  // PRONALAŽENJE PO EMAILU
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // PRONALAŽENJE PO ID
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // SVI KORISNICI
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // AŽURIRANJE REFRESH TOKENA
  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  // UKLANJANJE REFRESH TOKENA
  async removeRefreshToken(userId: number): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }
}
