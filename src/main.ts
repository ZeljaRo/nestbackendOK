import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3005);
  console.log('✅ Backend pokrenut na http://localhost:3005');
}

bootstrap();
