import {Global, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";
import KeyvRedis from "@keyv/redis";
import { RedisModule } from "./core/redis/redis.module";
import { databaseConfig } from "./core/database/database.config";
import { UsersModule } from "./users/users.module";
import { ResourcesModule } from "./resources/resources.module";
import { SlotsModule } from "./slots/slots.module";
import { BookingsModule } from "./bookings/bookings.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import {
  MAIN_EXCHANGE,
  RETRY_EXCHANGE,
  DLQ_EXCHANGE,
  MAIN_QUEUE,
  RETRY_QUEUE,
  DLQ_QUEUE,
  RETRY_TTL_MS,
} from "./notifications/notifications.constants";

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    CacheModule.register({
      isGlobal: true,
      stores: [
        new KeyvRedis('redis://redis:6379', {
          throwOnConnectError: true,
          throwOnErrors: true,
        })
      ],
    }),
    RabbitMQModule.forRoot({
      exchanges: [
        { name: MAIN_EXCHANGE, type: 'topic' },
        { name: RETRY_EXCHANGE, type: 'topic' },
        { name: DLQ_EXCHANGE, type: 'topic' },
      ],
      uri: ['amqp://rabbitmq:rabbitmq@rabbitmq:5672'],
      connectionInitOptions: { wait: true },
      queues: [
        { name: MAIN_QUEUE, exchange: MAIN_EXCHANGE, routingKey: 'booking.*', options: { durable: true }  },
        {
          name: RETRY_QUEUE,
          exchange: RETRY_EXCHANGE,
          routingKey: 'booking.*',
          options: {
            arguments: {
              'x-message-ttl': RETRY_TTL_MS,
              'x-dead-letter-exchange': MAIN_EXCHANGE,
              'x-dead-letter-routing-key': 'booking.retry',
            },
            durable: true,
          }
        },
        {
          name: DLQ_QUEUE,
          exchange: DLQ_EXCHANGE,
          routingKey: 'booking.*',
          options: {
            durable: true,
          },
        },
      ]
    }),
    RedisModule,
    UsersModule,
    ResourcesModule,
    SlotsModule,
    BookingsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [RabbitMQModule],
})
export class AppModule {}
