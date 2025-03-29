// Importiramo @Module dekorator koji definira da je ovo NestJS modul
import { Module } from '@nestjs/common';

// Importiramo TypeOrmModule kako bismo mogli koristiti repozitorij za User entitet
import { TypeOrmModule } from '@nestjs/typeorm';

// Importiramo servis koji sadrži poslovnu logiku korisnika
import { UserService } from './user.service';

// Importiramo kontroler koji obrađuje HTTP zahtjeve za korisnike
import { UserController } from './user.controller';

// Importiramo entitet korisnika (predstavlja tablicu u bazi)
import { User } from './user.entity';

// Deklariramo modul pomoću @Module dekoratora
@Module({
  // imports služi za povezivanje s bazom pomoću TypeORM repozitorija za entitet User
  imports: [TypeOrmModule.forFeature([User])],

  // controllers definira koji kontroleri su dio ovog modula (tu dolaze HTTP rute)
  controllers: [UserController],

  // providers označava koji servisi su dostupni unutar modula
  providers: [UserService],

  // exports omogućuje da druge module mogu koristiti ovaj servis (npr. auth modul)
  exports: [UserService],
})
export class UserModule {}
