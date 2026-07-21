import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:rabbitmq@rabbitmq:5672'],
      queue: 'test_queue',
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });

  await app.startAllMicroservices()
    .then(() => console.log('🚀 [RabbitMQ] Мікросервіс успішно запущено та підключено!'))
    .catch((err) => console.error('❌ [RabbitMQ] Помилка підключення мікросервісу:', err));

  await app.listen(PORT)
  console.log(`Server started on port ${PORT}`);
}

bootstrap();
