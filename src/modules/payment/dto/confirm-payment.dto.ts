// dto/confirm-payment.dto.ts
export class ConfirmPaymentDto {
  paymentKey: string;
  orderId: string;
  amount: number;
}
