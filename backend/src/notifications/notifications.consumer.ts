import { Injectable, NotFoundException } from "@nestjs/common";
import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { DLQ_EXCHANGE, MAIN_EXCHANGE, MAIN_QUEUE, RETRY_EXCHANGE } from "./notifications.constants";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class NotificationsConsumer {
  constructor(
    private readonly amqp: AmqpConnection,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private readonly MAX_RETRY_COUNT = 3;

  @RabbitSubscribe({
    exchange: MAIN_EXCHANGE,
    routingKey: 'booking.*',
    queue: MAIN_QUEUE,
    queueOptions: { durable: true },
  })
  async bookingCreated(msg: { userId: string; slotId: string }, amqpMsg: any) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: msg.userId,
        }
      })

      if (!user) {
        throw new NotFoundException("User does not exist");
      }

      console.log(`Email sent to user with email: ${user?.email}`)
    } catch (error) {
      const retryCount = amqpMsg?.properties?.headers?.['x-retry-count'] ?? 0;
      const next = retryCount + 1;

      console.warn(
        `Failed processing, attempt ${next}/${this.MAX_RETRY_COUNT}: ${error.message}`,
      );

      if (next >= this.MAX_RETRY_COUNT) {
        await this.amqp.publish(DLQ_EXCHANGE, 'booking.failed', msg, {
          persistent: true,
          headers: {
            'x-original-error': error.message,
            'x-retry-count': next,
            'x-failed-at': new Date().toISOString(),
          },
        });
        return;
      }

      await this.amqp.publish(RETRY_EXCHANGE, 'booking.retry', msg, {
        persistent: true,
        headers: {
          'x-retry-count': next,
        },
      });
      return;
    }
  }
}