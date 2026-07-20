import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from "@nestjs/typeorm";
import {CacheModule} from "@nestjs/cache-manager";
import KeyvRedis from "@keyv/redis";
import {RedisModule} from "./core/redis/redis.module";

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
