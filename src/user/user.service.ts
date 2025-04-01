// Uvoz osnovnih NestJS alata
import { Injectable, Inject } from '@nestjs/common';

// TypeORM alati za povezivanje s bazom
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Naš entitet korisnika
import { User } from './user.entity';

// Uvoz za cache manager iz NestJS i odgovarajućeg tipa
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    // Ubrizgavamo cache manager koji će upravljati Redis keširanjem
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    // Brisanje keša jer dodajemo novog korisnika
    await this.cacheManager.del('all_users');
    console.log('🧹 Obrisan cache: all_users');

    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    console.log('🔍 Pozvana je metoda findAll()');

    const cached = await this.cacheManager.get<User[]>('all_users');
    if (cached) {
      console.log('✅ Vraćeno iz cache-a');
      return cached;
    }

    const users = await this.userRepository.find();
    await this.cacheManager.set('all_users', users, 60_000);

    console.log('✅ Vraćeno iz baze i spremljeno u cache');
    return users;
  }
}
