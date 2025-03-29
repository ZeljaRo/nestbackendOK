import { DataSourceOptions } from 'typeorm';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'nest_user',
  password: 'lozinka123',
  database: 'mydb',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
};
