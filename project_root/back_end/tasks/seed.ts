import mongoose from 'mongoose';
import { randomInt as secureRandomInt } from 'node:crypto';
import { v4 as uuid } from 'uuid';
import connectDB from '../Config/mongooseConfig.ts';
import User from '../data_model_layer/User.ts';

const today = new Date().toISOString().slice(0, 10);
const SEED_UUID_PREFIXES = ['seed-ny-', 'seed-sf-', 'seed-houston-'];

const getSecureRandomInRange = (min: number, max: number) => {
  return secureRandomInt(min, max + 1);
};

const newYorkNeighborhoods = [
  'West Village',
  'Harlem',
  'Williamsburg',
  'Park Slope',
  'Astoria',
  'Flushing',
  'Bronxdale',
  'Riverdale',
];

const sanFranciscoNeighborhoods = [
  'Marina',
  'Midtown',
  'Pacific Heights',
  'Nob Hill',
  'Noe Valley',
];

const houstonNeighborhoods = [
  'Greater Heights',
  'Midtown',
  'Montrose',
  'River Oaks',
  'Museum Park',
];

const incomeRanges: Array<[number, number]> = [
  [42000, 62000],
  [55000, 75000],
  [65000, 90000],
  [80000, 110000],
  [95000, 135000],
];

type CitySeedConfig = {
  city: 'New York' | 'San Francisco' | 'Houston';
  prefix: string;
  count: number;
  neighborhoods: string[];
  incomeRange: [number, number];
  rentRangeByNeighborhood: Record<string, [number, number]>;
  utilitiesRange: [number, number];
  insuranceDeductiblesRange: [number, number];
  otherRange: [number, number];
};

const citySeedConfigs: CitySeedConfig[] = [
  // NY: 40 users
  {
    city: 'New York',
    prefix: `seed-ny-${today}-`,
    count: 40, // Number of users to seed for New York
    neighborhoods: newYorkNeighborhoods,
    incomeRange: [42000, 135000],
    rentRangeByNeighborhood: {
      'West Village': [2800, 5200],
      Harlem: [1800, 3200],
      Williamsburg: [2500, 4600],
      'Park Slope': [2400, 4200],
      Astoria: [1800, 3300],
      Flushing: [1700, 3000],
      Bronxdale: [1600, 2800],
      Riverdale: [2100, 3600],
    },
    utilitiesRange: [110, 260],
    insuranceDeductiblesRange: [300, 1200],
    otherRange: [100, 600],
  },
  // SF: 35 users
  {
    city: 'San Francisco',
    prefix: `seed-sf-${today}-`,
    count: 35,
    neighborhoods: sanFranciscoNeighborhoods,
    incomeRange: [75000, 210000],
    rentRangeByNeighborhood: {
      Marina: [3600, 5600],
      Midtown: [2800, 4200],
      'Pacific Heights': [4200, 7000],
      'Nob Hill': [3400, 5600],
      'Noe Valley': [3900, 6200],
    },
    utilitiesRange: [120, 280],
    insuranceDeductiblesRange: [350, 1500],
    otherRange: [120, 700],
  },
  // Houston: 25 users
  {
    city: 'Houston',
    prefix: `seed-houston-${today}-`,
    count: 25,
    neighborhoods: houstonNeighborhoods,
    incomeRange: [45000, 155000],
    rentRangeByNeighborhood: {
      'Greater Heights': [1600, 2900],
      Midtown: [1500, 2800],
      Montrose: [1700, 3100],
      'River Oaks': [2600, 4800],
      'Museum Park': [1700, 3000],
    },
    utilitiesRange: [130, 280],
    insuranceDeductiblesRange: [250, 1100],
    otherRange: [90, 550],
  },
];

const randomInt = (min: number, max: number) =>
  getSecureRandomInRange(min, max);

const pick = <T>(arr: T[]): T =>
  arr[getSecureRandomInRange(0, arr.length - 1)]!;

const makeUser = (config: CitySeedConfig) => {
  const neighborhood = pick(config.neighborhoods);
  const [incomeMin, incomeMax] = config.incomeRange;
  const income = randomInt(incomeMin, incomeMax);

  const rentBase = config.rentRangeByNeighborhood[neighborhood] ?? [2000, 3500];

  return {
    UUID: `${config.prefix}${uuid()}`,
    economic_profile: {
      city: config.city,
      income,
      neighborhood,
      liabilities: {
        rent: randomInt(rentBase[0], rentBase[1]),
        insuranceDeductibles: randomInt(
          config.insuranceDeductiblesRange[0],
          config.insuranceDeductiblesRange[1],
        ),
        utilities: randomInt(
          config.utilitiesRange[0],
          config.utilitiesRange[1],
        ),
        other: randomInt(config.otherRange[0], config.otherRange[1]),
      },
    },
  };
};

const main = async () => {
  await connectDB();

  await User.deleteMany({
    $or: SEED_UUID_PREFIXES.map((prefix) => ({
      UUID: { $regex: `^${prefix}` },
    })),
  });

  console.log(
    `=> Deleted ${SEED_UUID_PREFIXES.length} seeded users for New York, San Francisco, and Houston`,
  );

  const users = citySeedConfigs.flatMap((config) =>
    Array.from({ length: config.count }, () => makeUser(config)),
  );
  await User.insertMany(users);

  console.log(
    `=> Inserted ${users.length} seeded users for New York, San Francisco, and Houston`,
  );

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
