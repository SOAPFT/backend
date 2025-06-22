import * as dotenv from 'dotenv';
import * as path from 'path';
import { AppDataSource } from '../config/orm.config';
import { LoggerService } from '../src/utils/logger.service';

const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(process.cwd(), `env/.${nodeEnv}.env`) });
const logger = LoggerService.getInstance().logger;

async function syncDatabase() {
  try {
    logger.info('🧀 soapft database sync..');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    logger.info('🧀 데이터베이스 연결 성공');

    await AppDataSource.synchronize(false);

    // 생성된 테이블 목록 가져오기
    const tables = await AppDataSource.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
    );

    logger.info('🧀 생성된 테이블 목록:');
    tables.forEach((table) => {
      logger.info(`- ${table.table_name}`);
    });

    logger.info('🧀 데이터베이스 스키마 동기화 완료');
  } catch (error) {
    logger.error(
      '🧀 데이터베이스 스키마 동기화 중 오류가 발생했습니다:',
      error,
    );
  } finally {
    // 연결 종료
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      logger.info('🧀 데이터베이스 연결을 종료합니다.');
    }
  }
}

// 스크립트 실행
syncDatabase();
