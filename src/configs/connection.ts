import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  migrationsTableName: 'migrations',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  type: 'postgres',
  logging: true,
  synchronize: true,
  name: 'default',
  entities: ['dist/entities/**.js'],
  migrations: ['dist/migrations/**.js'],
});
