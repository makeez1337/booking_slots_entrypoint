import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'app',
  autoLoadEntities: true,
  synchronize: true,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
};
