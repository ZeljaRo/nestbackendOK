// Uvozimo validacijske dekoratore
import { IsEmail, IsOptional, MinLength } from 'class-validator';

// DTO klasa za ažuriranje korisnika – sva polja su opcionalna jer se možda mijenja samo jedno
export class UpdateUserDto {
  // Ako se šalje novi email – mora biti ispravno napisan
  @IsOptional()
  @IsEmail()
  email?: string;

  // Ako se šalje nova lozinka – mora imati barem 6 znakova
  @IsOptional()
  @MinLength(6)
  password?: string;
}
