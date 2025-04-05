import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  /**
   * Dummy metoda za slanje reset linka putem e-maila.
   * Umjesto stvarnog slanja, ispisuje poruku u konzolu.
   * 
   * @param email - Email korisnika kojem se šalje reset link
   * @param token - Token za resetiranje lozinke
   */
  sendResetEmail(email: string, token: string): void {
    // Ovo bi u stvarnom svijetu bio link koji korisnik otvori
    const resetLink = `http://localhost:3000/reset?token=${token}`;

    // Dummy output u konzolu – simulacija slanja emaila
    console.log(`✅ [DUMMY EMAIL] Reset lozinke poslan na: ${email}`);
    console.log(`🔗 Reset link: ${resetLink}`);
  }
}
