import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Slot } from '../../slots/entities/slot.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Notification } from '../../notifications/entities/notification.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // One booking per slot. The @OneToOne owner side emits a UNIQUE constraint
  // on slot_id, preventing double-booking even under concurrent requests.
  @Column({ type: 'uuid' })
  slot_id: string;

  @OneToOne(() => Slot, (slot) => slot.booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'slot_id' })
  slot: Slot;

  @Column({ type: 'varchar', length: 50, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment;

  @OneToMany(() => Notification, (notification) => notification.booking)
  notifications: Notification[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
