import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Resource } from '../../resources/entities/resource.entity';
import { Booking } from '../../bookings/entities/booking.entity';

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  BLOCKED = 'BLOCKED',
}

@Entity('slots')
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  resource_id: string;

  @ManyToOne(() => Resource, (resource) => resource.slots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ type: 'varchar', length: 50, default: SlotStatus.AVAILABLE })
  status: SlotStatus;

  @OneToOne(() => Booking, (booking) => booking.slot)
  booking: Booking;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
