import { Injectable, BadRequestException } from '@nestjs/common';
import { Payment } from '@/entities/payment.entity';
import { User } from '@/entities/user.entity';
import { Withdrawal } from '@/entities/withdrawal.entity';
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
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepo: Repository<Withdrawal>,
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

  async withdrawCoins(userUuid: string, amount: number, accountNumber: string) {
    const user = await this.userRepo.findOneBy({ userUuid });
    if (!user) throw new Error('사용자를 찾을 수 없습니다.');
    if (user.coins < amount)
      throw new BadRequestException('보유 코인이 부족합니다.');

    user.coins -= amount;
    await this.userRepo.save(user);

    await this.withdrawalRepo.save({
      userUuid,
      amount,
      accountNumber,
      status: 'PENDING',
    });

    return { message: '출금 요청이 접수되었습니다.' };
  }
}
