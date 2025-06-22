import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { LoggerService } from '../src/utils/logger.service';

const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(process.cwd(), `env/.${nodeEnv}.env`) });
const logger = LoggerService.getInstance().logger;

async function dropDatabase() {
  const dbName = process.env.DB_DATABASE || 'soapft';

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'soapft',
  });

  try {
    logger.info('🧀 Database Dropping...');
    await client.connect();
    logger.info('🧀 데이터베이스에 연결되었습니다.');

    const terminateQuery = `
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${dbName}'
      AND pid <> pg_backend_pid();
    `;

    await client.query(terminateQuery);
    logger.info(`'${dbName}'🧀 데이터베이스에 대한 모든 커넥션 종료함`);

    // 데이터베이스 삭제
    await client.query(`DROP DATABASE IF EXISTS "${dbName}";`);
    logger.info(`'${dbName}'🧀 데이터베이스 삭제 완료`);

    // 데이터베이스 다시 생성 (선택 사항)
    await client.query(`CREATE DATABASE "${dbName}";`);
    logger.info(`'${dbName}'🧀 데이터베이스 재생성 완료`);
  } catch (error) {
    logger.error('🧀 데이터베이스 초기화 중 오류가 발생:', error);
  } finally {
    await client.end();
    logger.info('🧀 데이터베이스 연결을 종료합니다.');
  }
}

dropDatabase();
