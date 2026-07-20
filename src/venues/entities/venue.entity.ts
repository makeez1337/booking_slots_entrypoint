import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Resource } from '../../resources/entities/resource.entity';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string | null;

  @Column({ type: 'time', nullable: true })
  opening_time: string | null;

  @Column({ type: 'time', nullable: true })
  closing_time: string | null;

  @OneToMany(() => Resource, (resource) => resource.venue)
  resources: Resource[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
