import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Resource } from '../resources/entities/resource.entity';
import { Slot } from '../slots/entities/slot.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { User } from '../users/entities/user.entity';

/**
 * Standalone seed script for dummy resources + slots.
 *
 * Run from the host machine (Postgres exposed on localhost:5432):
 *   npm run seed
 * Or inside the backend container:
 *   DB_HOST=postgres npm run seed
 */
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'app',
  entities: [Resource, Slot, Booking, User],
  synchronize: true,
});

// A few bookable resources with the slots we want to generate for each.
const RESOURCES = [
  { name: 'Tennis Court #1', description: 'Outdoor clay court', capacity: 1 },
  { name: 'Meeting Room A', description: 'Seats up to 8 people', capacity: 8 },
  { name: 'Massage Therapist', description: '60-minute sessions', capacity: 1 },
];

// Generate hourly slots (09:00–17:00) for the next `days` days.
function buildSlots(days = 3): { starts_at: Date; ends_at: Date }[] {
  const slots: { starts_at: Date; ends_at: Date }[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  for (let day = 1; day <= days; day++) {
    for (let hour = 9; hour < 17; hour++) {
      const starts_at = new Date(base);
      starts_at.setDate(base.getDate() + day);
      starts_at.setHours(hour);

      const ends_at = new Date(starts_at);
      ends_at.setHours(hour + 1);

      slots.push({ starts_at, ends_at });
    }
  }
  return slots;
}

async function seed(): Promise<void> {
  await dataSource.initialize();
  console.log('Connected. Seeding dummy data...');

  const resourceRepo = dataSource.getRepository(Resource);
  const slotRepo = dataSource.getRepository(Slot);
  const userRepo = dataSource.getRepository(User);

  // Idempotent: wipe existing data so re-running is safe (FK-safe order).
  await dataSource.getRepository(Booking).createQueryBuilder().delete().execute();
  await slotRepo.createQueryBuilder().delete().execute();
  await resourceRepo.createQueryBuilder().delete().execute();

  // Demo users (needed so bookings have a valid user_id FK). Upsert by email
  // so we don't wipe any real users you may already have.
  await userRepo.upsert(
    [
      { email: 'alice@example.com', first_name: 'Alice', last_name: 'Demo' },
      { email: 'bob@example.com', first_name: 'Bob', last_name: 'Demo' },
    ],
    ['email'],
  );
  const users = await userRepo.find();
  console.log(`  users available: ${users.length}`);

  let totalSlots = 0;
  for (const def of RESOURCES) {
    const resource = await resourceRepo.save(
      resourceRepo.create({ name: def.name, description: def.description }),
    );

    const slots = buildSlots().map((s) =>
      slotRepo.create({
        resource_id: resource.id,
        starts_at: s.starts_at,
        ends_at: s.ends_at,
        capacity: def.capacity,
        booked_count: 0,
      }),
    );
    await slotRepo.save(slots);
    totalSlots += slots.length;

    console.log(`  ${def.name}: ${slots.length} slots`);
  }

  console.log(
    `Done. Inserted ${RESOURCES.length} resources and ${totalSlots} slots.`,
  );
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exitCode = 1;
});
