import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

const nodeEnv = process.env.NODE_ENV || 'development';
config({ path: `env/.${nodeEnv}.env` });

// NestJS에서 사용되는 설정
export const typeOrmConfig = (configService: ConfigService): any => {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: parseInt(configService.get('DB_PORT') || '5432', 10),
    username: configService.get('DB_USERNAME') || 'postgres',
    password: configService.get('DB_PASSWORD') || 'postgres',
    database: configService.get('DB_DATABASE') || 'soapft',
    entities: ['src/**/*.entity.{js,ts}'],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') !== 'production',
    migrations: ['database/migrations/**/*.{js,ts}'],
    migrationsTableName: 'migrations',
    ssl:
      configService.get('NODE_ENV') === 'production'
        ? { rejectUnauthorized: false }
        : false,
  };
};

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'soapft',
  entities: ['src/**/*.entity.{js,ts}'],
  migrations: ['database/migrations/**/*.{js,ts}'],
  migrationsTableName: 'migrations',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  seeds: ['database/seeds/**/*.{js,ts}'],
  factories: ['database/factories/**/*.{js,ts}'],
} as DataSourceOptions & { seeds?: string[]; factories?: string[] };

// TypeORM CLI를 위한 DataSource 인스턴스
export const AppDataSource = new DataSource(dataSourceOptions);

// 기존 호환성을 위한 내보내기
export default typeOrmConfig;
