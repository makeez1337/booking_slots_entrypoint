import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Resource } from '../../resources/entities/resource.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('slots')
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Resource, (resource) => resource.slots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;

  @Column({ type: 'uuid' })
  resource_id: string;

  @Column({ type: 'timestamptz' })
  starts_at: Date;

  @Column({ type: 'timestamptz' })
  ends_at: Date;

  @Column({ type: 'int', default: 1 })
  capacity: number;

  @Column({ type: 'int', default: 0 })
  booked_count: number;

  @OneToMany(() => Booking, (booking) => booking.slot)
  bookings: Booking[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
