import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  imports: [JwtModule.register({})], // ✅ Dodajemo JwtModule da se može injectati
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
