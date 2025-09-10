import { Injectable, Logger } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService {
  private readonly logger = new Logger(SqsService.name);
  private sqsClient: SQSClient;
  private readonly queueUrl: string;

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION || 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.queueUrl =
      process.env.SQS_QUEUE_URL ||
      'https://sqs.ap-northeast-2.amazonaws.com/305601180063/soapft-image-verification';
  }

  /**
   * 이미지 검증 작업을 SQS 큐에 전송
   */
  async sendImageVerificationTask(payload: {
    verificationId: number;
    postUuid: string;
    imageUrl: string;
    challengeTitle: string;
    challengeDescription?: string;
    verificationGuide?: string;
  }): Promise<void> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(payload),
        MessageAttributes: {
          verificationId: {
            DataType: 'Number',
            StringValue: payload.verificationId.toString(),
          },
          postUuid: {
            DataType: 'String',
            StringValue: payload.postUuid,
          },
        },
      });

      const response = await this.sqsClient.send(command);

      this.logger.log(
        `SQS 메시지 전송 성공 - MessageId: ${response.MessageId}, VerificationId: ${payload.verificationId}`,
      );
    } catch (error) {
      this.logger.error('SQS 메시지 전송 실패:', error);
      throw new Error(`SQS 메시지 전송 실패: ${error.message}`);
    }
  }

  /**
   * 여러 이미지 검증 작업을 배치로 전송
   */
  async sendBatchImageVerificationTasks(
    tasks: Array<{
      verificationId: number;
      postUuid: string;
      imageUrl: string;
      challengeTitle: string;
      challengeDescription?: string;
      verificationGuide?: string;
    }>,
  ): Promise<void> {
    const promises = tasks.map((task) => this.sendImageVerificationTask(task));
    await Promise.all(promises);
  }
}
