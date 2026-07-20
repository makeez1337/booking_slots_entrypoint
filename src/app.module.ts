import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";
import KeyvRedis from "@keyv/redis";
import { RedisModule } from "./core/redis/redis.module";
import { UsersModule } from "./users/users.module";
import { VenuesModule } from "./venues/venues.module";
import { ResourcesModule } from "./resources/resources.module";
import { SlotsModule } from "./slots/slots.module";
import { BookingsModule } from "./bookings/bookings.module";
import { PaymentsModule } from "./payments/payments.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'app',
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    CacheModule.register({
      isGlobal: true,
      stores: [
        new KeyvRedis('redis://redis:6379', {
          throwOnConnectError: true,
          throwOnErrors: true,
        })
      ],
    }),
    RedisModule,
    UsersModule,
    VenuesModule,
    ResourcesModule,
    SlotsModule,
    BookingsModule,
    PaymentsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
