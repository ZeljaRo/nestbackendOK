import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';

import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // Povezivanje s PostgreSQL bazom
    TypeOrmModule.forRoot(databaseConfig),

    // Konfiguracija Redis cache-a
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        }),
      }),
      isGlobal: true, // globalna dostupnost
    }),

    // JWT dostupan svugdje gdje treba (npr. TokenService)
    JwtModule.register({}), // ⬅ potrebno za TokenService i reset lozinke

    // Glavni moduli
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
