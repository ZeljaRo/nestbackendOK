// Uvozimo dekoratore za validaciju iz biblioteke 'class-validator'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// Definiramo DTO (Data Transfer Object) klasu za kreiranje novog korisnika
export class CreateUserDto {
  // Provjera da je email ispravno napisan (npr. test@mail.com)
  @IsEmail()
  email: string;

  // Provjera da polje nije prazno (ne smije biti undefined, null ili prazan string)
  @IsNotEmpty()
  // Lozinka mora imati minimalnu duljinu od 6 znakova
  @MinLength(6)
  password: string;
}
