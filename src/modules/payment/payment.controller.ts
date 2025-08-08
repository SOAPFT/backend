import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { UserUuid } from '@/decorators/user-uuid.decorator';
import { ApiPostWithdraw } from './decorators/payment.swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('payment')
@ApiBearerAuth('JWT-auth')
@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async fakeConfirm(
    @Body() body: { amount: number },
    @Req() req: Request,
    @UserUuid() userUuid: string,
  ) {
    return this.paymentService.grantCoins(userUuid, body.amount);
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  @ApiPostWithdraw()
  async withdraw(
    @Body() body: { amount: number; accountNumber: string },
    @UserUuid() userUuid: string,
  ) {
    return this.paymentService.withdrawCoins(
      userUuid,
      body.amount,
      body.accountNumber,
    );
  }
}
