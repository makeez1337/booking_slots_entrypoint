import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Slot } from '../slots/entities/slot.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { NOTIFICATIONS_SERVICE_CLIENT } from "../notifications/notifications.constants";

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Slot]),
    ClientsModule.register([
      {
        name: NOTIFICATIONS_SERVICE_CLIENT, // The injection token
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:rabbitmq@rabbitmq:5672'], // Your RabbitMQ server URL
          queue: 'notifications_queue', // Target queue name
          queueOptions: {
            durable: true, // Queue survives broker restarts
          },
        },
      },
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [TypeOrmModule],
})
export class BookingsModule {}
