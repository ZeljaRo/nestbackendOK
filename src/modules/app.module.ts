import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';  // ✅ Tačna putanja za config/
import { UserModule } from '../user/user.module';  // ✅ Tačna putanja za user/
import { AuthModule } from '../auth/auth.module';  // ✅ Tačna putanja za auth/

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
