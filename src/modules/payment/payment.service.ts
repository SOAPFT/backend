import { Injectable } from '@nestjs/common';
import { Payment } from '@/entities/payment.entity';
import { User } from '@/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// payment.service.ts
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async grantCoins(userUuid: string, amount: number) {
    const user = await this.userRepo.findOneBy({ userUuid: userUuid });

    if (!user) {
    }

    user.coins += amount;

    await this.userRepo.save(user);

    await this.paymentRepo.save({
      userUuid,
      orderId: `test_${Date.now()}`,
      amount,
      status: 'SUCCESS',
    });

    return { message: '코인 지급 완료' };
  }
}
