import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { UserUuid } from '@/decorators/user-uuid.decorator';

@Controller('payment')
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
}
