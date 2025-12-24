import { UserProfile } from '../types';

export interface SimulationProfile {
  heartRate: { base: number; range: [number, number] };
  steps: { base: number; range: [number, number] };
  weight: { base: number; range: [number, number] };
  sleep: { base: number; range: [number, number] };
  water: { base: number; range: [number, number] };
  calories: { base: number; range: [number, number] };
}

export const profiles: Record<UserProfile, SimulationProfile> = {
  sedentary: {
    heartRate: { base: 72, range: [60, 85] },
    steps: { base: 3000, range: [1000, 6000] },
    weight: { base: 75, range: [70, 80] },
    sleep: { base: 6.5, range: [5, 8] },
    water: { base: 1500, range: [1000, 2000] },
    calories: { base: 1800, range: [1500, 2200] },
  },
  active: {
    heartRate: { base: 68, range: [55, 80] },
    steps: { base: 8000, range: [5000, 12000] },
    weight: { base: 72, range: [68, 76] },
    sleep: { base: 7.5, range: [6.5, 8.5] },
    water: { base: 2200, range: [1800, 2800] },
    calories: { base: 2400, range: [2000, 3000] },
  },
  athlete: {
    heartRate: { base: 58, range: [45, 70] },
    steps: { base: 12000, range: [8000, 18000] },
    weight: { base: 70, range: [65, 75] },
    sleep: { base: 8.5, range: [7, 10] },
    water: { base: 3000, range: [2500, 3500] },
    calories: { base: 3000, range: [2500, 4000] },
  },
  recovery: {
    heartRate: { base: 70, range: [60, 85] },
    steps: { base: 5000, range: [3000, 8000] },
    weight: { base: 73, range: [70, 76] },
    sleep: { base: 8, range: [7, 9] },
    water: { base: 2000, range: [1500, 2500] },
    calories: { base: 2000, range: [1700, 2400] },
  },
};

export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const randomNormal = (mean: number, stdDev: number): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * stdDev + mean;
};

export const getTimeOfDayMultiplier = (date: Date): number => {
  const hours = date.getHours();
  // Утро (6-9): 0.9, День (9-18): 1.1, Вечер (18-22): 0.95, Ночь (22-6): 0.85
  if (hours >= 6 && hours < 9) return 0.9;
  if (hours >= 9 && hours < 18) return 1.1;
  if (hours >= 18 && hours < 22) return 0.95;
  return 0.85;
};

