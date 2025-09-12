import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

const nodeEnv = process.env.NODE_ENV || 'development';
config({ path: `env/.${nodeEnv}.env` });

export const typeOrmConfig = (configService: ConfigService): any => {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: parseInt(configService.get('DB_PORT') || '5432', 10),
    username: configService.get('DB_USERNAME') || 'postgres',
    password: configService.get('DB_PASSWORD') || 'postgres',
    database: configService.get('DB_DATABASE') || 'soapft',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') !== 'production',
    migrations: [__dirname + '/../database/migrations/**/*.{js,ts}'],
    migrationsTableName: 'migrations',
    ssl: { rejectUnauthorized: false },
  };
};

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'soapft',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/**/*.{js,ts}'],
  migrationsTableName: 'migrations',
  ssl: { rejectUnauthorized: false },
};

export const AppDataSource = new DataSource(dataSourceOptions);
export default typeOrmConfig;
