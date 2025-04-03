import { SetMetadata } from '@nestjs/common';

// 🔐 Ključ koji ćemo kasnije koristiti u guardu
export const ROLES_KEY = 'roles';

/**
 * @Roles('admin') → koristi se u kontroleru
 * Postavlja metapodatke koje role imaju pristup ruti
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
