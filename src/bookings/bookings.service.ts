import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { Slot } from '../slots/entities/slot.entity';
import { RedisService } from '../core/redis/redis.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ClientProxy } from "@nestjs/microservices";
import { NOTIFICATIONS_SERVICE_CLIENT } from "../notifications/notifications.constants";

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly redis: RedisService,
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(NOTIFICATIONS_SERVICE_CLIENT) private readonly clientProxy: ClientProxy,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const slot = await queryRunner.manager
        .createQueryBuilder(Slot, "slot")
        .setLock("pessimistic_write")
        .where("slot.id = :id", { id: dto.slotId })
        .getOne();

      if (!slot) {
        throw new NotFoundException('Slot not found');
      }

      if (slot.booked_count >= slot.capacity) {
        throw new ConflictException('Slot is fully booked');
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
      slot.booked_count += 1;

      await queryRunner.manager.save(slot);

      const booking = queryRunner.manager.create(Booking, {
        user_id: dto.userId,
        slot_id: slot.id,
        status: BookingStatus.CONFIRMED,
      })

      await queryRunner.manager.save(booking)

      await queryRunner.commitTransaction()

      this.clientProxy.emit('booking.created', { userId: dto.userId, slotId: slot.id })

      return booking
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  findAll(): Promise<Booking[]> {
    return this.bookingRepo.find({ order: { created_at: 'DESC' } });
  }
}
