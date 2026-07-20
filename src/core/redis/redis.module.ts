import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import {REDIS_CLIENT} from "./redis.constants";

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'redis',
          // port: parseInt(process.env.REDIS_PORT, 10) || 6379,
          port: 6379,
          // password: process.env.REDIS_PASSWORD,
          maxRetriesPerRequest: null, // Critical for robust connection retries
        });
      },
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
