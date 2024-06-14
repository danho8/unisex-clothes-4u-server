export default {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: ['dist/entities/*.js'],
  migrations: ['dist/migrations/*.js'],
  factories: ['dist/database/factories/*.js'],
  seeds: ['dist/database/seeds/*.js'],
};
