import { Injectable, NotFoundException } from "@nestjs/common";
import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import {DLQ_EXCHANGE, MAIN_EXCHANGE, MAIN_QUEUE, RETRY_EXCHANGE} from "../app.module";
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
  async bookingCreated(msg: unknown, amqpMsg: any) {
    console.log(msg, "MESSAGE++");

    try {
      const user = await this.userRepository.findOne({
        where: {
          id: 'asdqwe',
        }
      })

      if (!user) {
        throw new NotFoundException("User does not exist");
      }

      console.log(`Email sent to user with email: ${user?.email}`)
    } catch (error) {
      const retryCount = this.getRetryCount(amqpMsg);

      console.warn(
        `Помилка обробки, спроба ${retryCount + 1}/${this.MAX_RETRY_COUNT}: ${error.message}`,
      );

      if (retryCount >= this.MAX_RETRY_COUNT) {
        // вичерпали спроби — відправляємо у фінальну DLQ вручну,
        // додавши причину помилки для дебагу
        await this.amqp.publish(DLQ_EXCHANGE, 'booking.failed', msg, {
          persistent: true,
          headers: {
            'x-original-error': error.message,
            'x-retry-count': retryCount,
            'x-failed-at': new Date().toISOString(),
          },
        });
        return; // ack — забираємо з основного потоку
      }

      // відправляємо в retry-чергу — там повідомлення почекає TTL
      // і саме повернеться в main.queue
      await this.amqp.publish(RETRY_EXCHANGE, 'booking.retry', msg, {
        persistent: true,
      });
      return; // ack оригінального повідомлення, бо копію вже відправили в retry
    }
  }

  private getRetryCount(amqpMsg: any): number {
    const deathHeader = amqpMsg?.properties?.headers?.['x-death'];
    if (!deathHeader || !Array.isArray(deathHeader)) return 0;
    // сумуємо count по всіх "смертях" через retry-чергу
    console.log(deathHeader, 'DEATH HEADER');
    const retryDeath = deathHeader.find(
      (d: any) => d.queue === 'notifications.retry.queue',
    );
    return retryDeath?.count ?? 0;
  }
}