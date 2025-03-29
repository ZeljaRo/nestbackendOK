import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'moj_tajni_kljuc',  // ✅ KLJUČ JE DEFINIRAN OVDJE
    });
  }

  async validate(payload: any) {
    return { id: payload.id, email: payload.email };  // ✅ OSIGURAVAMO ISPRAVAN FORMAT!
  }
}
