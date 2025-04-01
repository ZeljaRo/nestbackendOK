// Uvozimo potrebne dekoratore iz NestJS-a za definiranje ruta i upravljanje HTTP zahtjevima
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

// Uvozimo servis koji sadrži logiku vezanu uz korisnike
import { UserService } from './user.service';

// Definiramo ovaj kontroler s prefiksom 'users' → sve rute počinju s /users
@Controller('users')
export class UserController {
  // Injektiramo UserService putem konstruktora
  constructor(private readonly userService: UserService) {}

  // Ruta: GET /users
  // Vraća sve korisnike iz baze
  @Get()
  async findAll() {
    console.log('📡 Poziv iz kontrolera je stigao do findAll()');
    return this.userService.findAll();
  }

  // Ruta: GET /users/:id
  // Dohvaća jednog korisnika na temelju ID-a iz URL-a
  @Get(':id')
  async findById(
    // Uzima parametar `id` iz URL-a i pretvara ga u broj pomoću ParseIntPipe
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.findById(id);
  }
}
