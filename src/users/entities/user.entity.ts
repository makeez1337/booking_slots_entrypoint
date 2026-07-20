import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  first_name: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  last_name: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
