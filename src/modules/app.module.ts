// Uvozimo osnovne NestJS module
import { Module } from '@nestjs/common';

// Uvozimo TypeORM i našu konfiguraciju baze
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';

// Uvozimo naša dva modula
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

// Uvozimo CacheModule i registraciju za Redis cache
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

// Deklariramo AppModule
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
      isGlobal: true,  // Cache dostupna globalno u cijeloj aplikaciji
    }),

    // Uključivanje ostalih modula
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
