import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  // Inject the raw ioredis instance created in the factory
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  // Example abstract wrapper method
  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Example helper method with TTL
  async setJson(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const stringified = JSON.stringify(value);
    if (ttlSeconds) {
      await this.redisClient.set(key, stringified, 'EX', ttlSeconds);
    } else {
      await this.redisClient.set(key, stringified);
    }
  }

  // Cleanly disconnect when the server shuts down
  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
