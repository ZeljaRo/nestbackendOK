import {
    Injectable,
    CanActivate,
    ExecutionContext,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from './roles.decorator';
  import { JwtPayload } from './jwt.strategy';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      // 📌 Dohvaćamo dozvoljene role s route pomoću metapodataka
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
  
      // 📌 Ako ruta nema definirane role, svi imaju pristup
      if (!requiredRoles) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user: JwtPayload = request.user;
  
      // 📌 Provjera je li korisnikova rola među dozvoljenima
      return requiredRoles.includes(user.role);
    }
  }
  