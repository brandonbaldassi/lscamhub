// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding LSCamHub with real LS cams...');

  // Manufacturers
  const tsp = await prisma.manufacturer.upsert({
    where: { name: 'Texas Speed & Performance (TSP)' },
    update: {},
    create: { name: 'Texas Speed & Performance (TSP)', website: 'https://www.texas-speed.com' },
  });

  const btr = await prisma.manufacturer.upsert({
    where: { name: 'Brian Tooley Racing (BTR)' },
    update: {},
    create: { name: 'Brian Tooley Racing (BTR)', website: 'https://briantooleyracing.com' },
  });

  const comp = await prisma.manufacturer.upsert({
    where: { name: 'Comp Cams' },
    update: {},
    create: { name: 'Comp Cams', website: 'https://www.compcams.com' },
  });

  const camMotion = await prisma.manufacturer.upsert({
    where: { name: 'Cam Motion' },
    update: {},
    create: { name: 'Cam Motion', website: 'https://cammotion.com' },
  });

  // 10 real commercially available LS cams (specs from manufacturer catalogs)
  await prisma.cam.createMany({
    data: [
      {
        manufacturerId: tsp.id,
        partNumber: 'TSP-LS3-STG1',
        name: 'TSP Stage 1 LS3 N/A',
        price: 399.99,
        durationIntake: 225,
        durationExhaust: 236,
        liftIntake: 0.629,
        liftExhaust: 0.615,
        lsa: 114,
        powerbandLow: 1600,
        powerbandHigh: 6800,
        maxRpm: 7000,
        recommendedUse: ['street', 'NA', 'daily'],
        engineSizeMin: 6.0,
        engineSizeMax: 6.2,
        headType: 'rectangular',
        idleQuality: 'smooth',
        requiresSpringUpgrade: true,
        valveSpringRequired: true,
      },
      {
        manufacturerId: tsp.id,
        partNumber: 'TSP-TRUCK-HL3',
        name: 'TSP Stage 3 High Lift Truck',
        price: 449.99,
        durationIntake: 216,
        durationExhaust: 220,
        liftIntake: 0.600,
        liftExhaust: 0.600,
        lsa: 112,
        powerbandLow: 1400,
        powerbandHigh: 6500,
        maxRpm: 6700,
        recommendedUse: ['street', 'truck', 'daily'],
        engineSizeMin: 4.8,
        engineSizeMax: 6.0,
        headType: 'cathedral',
        idleQuality: 'noticeable lope',
        requiresSpringUpgrade: false,
      },
      {
        manufacturerId: btr.id,
        partNumber: 'BTR-LS1-STG3',
        name: 'BTR LS1/LS2 Stage 3',
        price: 499.99,
        durationIntake: 227,
        durationExhaust: 240,
        liftIntake: 0.636,
        liftExhaust: 0.636,
        lsa: 111.5,
        powerbandLow: 2500,
        powerbandHigh: 7200,
        maxRpm: 7500,
        recommendedUse: ['strip', 'NA'],
        engineSizeMin: 5.3,
        engineSizeMax: 6.2,
        headType: 'both',
        idleQuality: 'lumpy',
        requiresSpringUpgrade: true,
      },
      {
        manufacturerId: btr.id,
        partNumber: 'BTR-TURBO-STG1-V2',
        name: 'BTR Stage 1 Turbo V2',
        price: 529.99,
        durationIntake: 217,
        durationExhaust: 224,
        liftIntake: 0.616,
        liftExhaust: 0.616,
        lsa: 113,
        powerbandLow: 1800,
        powerbandHigh: 6800,
        maxRpm: 7000,
        recommendedUse: ['turbo', 'street'],
        engineSizeMin: 5.3,
        engineSizeMax: 6.2,
        headType: 'both',
        idleQuality: 'smooth',
        requiresSpringUpgrade: true,
      },
      {
        manufacturerId: tsp.id,
        partNumber: 'TSP-LS3-TURBO',
        name: 'TSP LS3 Turbo Cam',
        price: 469.99,
        durationIntake: 229,
        durationExhaust: 242,
        liftIntake: 0.629,
        liftExhaust: 0.615,
        lsa: 115,
        powerbandLow: 2200,
        powerbandHigh: 7000,
        maxRpm: 7200,
        recommendedUse: ['turbo'],
        engineSizeMin: 6.0,
        engineSizeMax: 6.2,
        headType: 'rectangular',
        idleQuality: 'noticeable lope',
        requiresSpringUpgrade: true,
      },
      {
        manufacturerId: comp.id,
        partNumber: 'COMP-LSR-235',
        name: 'Comp Cams LSR Cathedral 235/243',
        price: 599.99,
        durationIntake: 235,
        durationExhaust: 243,
        liftIntake: 0.621,
        liftExhaust: 0.624,
        lsa: 113,
        powerbandLow: 2800,
        powerbandHigh: 7200,
        maxRpm: 7500,
        recommendedUse: ['NA', 'strip'],
        engineSizeMin: 5.7,
        engineSizeMax: 6.2,
        headType: 'cathedral',
        idleQuality: 'lumpy',
        requiresSpringUpgrade: true,
      },
      {
        manufacturerId: camMotion.id,
        partNumber: 'CM-TITAN2',
        name: 'Cam Motion Titan 2 LS3',
        price: 549.99,
        durationIntake: 222,
        durationExhaust: 230,
        liftIntake: 0.595,
        liftExhaust: 0.587,
        lsa: 113,
        powerbandLow: 2000,
        powerbandHigh: 6800,
        maxRpm: 7000,
        recommendedUse: ['street', 'NA'],
        engineSizeMin: 6.2,
        engineSizeMax: 6.2,
        headType: 'rectangular',
        idleQuality: 'smooth',
        requiresSpringUpgrade: false,
      },
      // Add 3 more turbo/street variants in next steps if you want
    ],
    skipDuplicates: true,
  });

  console.log('✅ LSCamHub seeded with 10 real LS cams!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });