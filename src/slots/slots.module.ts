import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './entities/slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slot])],
  exports: [TypeOrmModule],
})
export class SlotsModule {}
