import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  booking_id: string;

  @ManyToOne(() => Booking, (booking) => booking.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column({ type: 'varchar', length: 50 })
  type: NotificationType;

  @Column({ type: 'varchar', length: 255 })
  recipient: string;

  @Column({ type: 'varchar', length: 50, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Column({ type: 'timestamp', nullable: true })
  sent_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
