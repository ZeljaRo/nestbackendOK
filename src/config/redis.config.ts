// Importiramo registerAs za definiranje konfiguracije
import { registerAs } from '@nestjs/config';

// Exportiramo konfiguraciju kao funkciju pod imenom 'redis'
export default registerAs('redis', () => ({
  host: 'localhost',  // Redis server na lokalnom stroju
  port: 6379,          // Standardni port za Redis
}));
