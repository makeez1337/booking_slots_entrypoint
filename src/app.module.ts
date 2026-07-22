import { Module } from '@nestjs/common';
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
    RedisModule,
    UsersModule,
    ResourcesModule,
    SlotsModule,
    BookingsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
