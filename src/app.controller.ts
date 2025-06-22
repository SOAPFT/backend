import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from 'winston';
import { ApiTags } from '@nestjs/swagger';
import { ApiHealthCheck } from './decorators/swagger.decorator';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @Get('logger')
  getHello(): string {
    this.logger.info('Called getHello()');
    this.logger.debug('Debug message');
    this.logger.error('Error message');
    return this.appService.getHello();
  }

  @Get('health')
  @ApiHealthCheck()
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
