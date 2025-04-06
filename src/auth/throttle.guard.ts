import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

// Memorijsko praćenje pokušaja
const attemptsMap = new Map<string, { count: number; lastAttempt: number }>();

@Injectable()
export class ThrottleGuard implements CanActivate {
  private readonly timeWindow = 60 * 1000; // 60 sekundi
  private readonly maxAttempts = 3; // Maksimalno 3 pokušaja

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const email = request.body?.email;

    if (!email) {
      throw new HttpException(
        '⚠️ E-mail nije poslan u zahtjevu',
        HttpStatus.BAD_REQUEST,
      );
    }

    const now = Date.now();
    const record = attemptsMap.get(email);

    if (!record) {
      // Prvi pokušaj
      attemptsMap.set(email, { count: 1, lastAttempt: now });
      return true;
    }

    const timePassed = now - record.lastAttempt;

    if (timePassed > this.timeWindow) {
      // Reset pokušaja nakon proteka vremena
      attemptsMap.set(email, { count: 1, lastAttempt: now });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      throw new HttpException(
        '🚫 Previše pokušaja – pokušajte kasnije',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Povećaj broj pokušaja
    record.count += 1;
    record.lastAttempt = now;
    attemptsMap.set(email, record);

    return true;
  }
}
