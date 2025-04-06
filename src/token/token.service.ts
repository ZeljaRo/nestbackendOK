import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Provjerava je li token istekao na temelju vremena unutar JWT payloada.
   * @param token JWT token koji treba provjeriti
   * @returns true ako je token istekao, inače false
   */
  isExpired(token: string): boolean {
    try {
      // Decode bez provjere potpisa – čitamo samo payload
      const decoded: any = this.jwtService.decode(token);

      if (!decoded || !decoded.exp) {
        return true; // ako nema exp uopće, smatramo da je neispravan
      }

      const currentTime = Math.floor(Date.now() / 1000); // trenutno vrijeme u sekundama
      return decoded.exp < currentTime;
    } catch (error) {
      return true; // ako ne može dekodirati, smatramo da je token nevažeći
    }
  }
}
