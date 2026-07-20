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
import { Venue } from '../../venues/entities/venue.entity';
import { Slot } from '../../slots/entities/slot.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  venue_id: string;

  @ManyToOne(() => Venue, (venue) => venue.resources, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', nullable: true })
  capacity: number | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => Slot, (slot) => slot.resource)
  slots: Slot[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
