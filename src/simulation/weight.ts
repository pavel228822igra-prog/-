import { UserProfile, HealthMetric } from '../types';
import { profiles, randomNormal } from './base';

export class WeightSimulator {
  private profile: UserProfile;
  private currentWeight: number;

  constructor(profile: UserProfile = 'active', initialWeight?: number) {
    this.profile = profile;
    this.currentWeight = initialWeight || profiles[profile].weight.base;
  }

  generateWeightReading(date: Date = new Date()): HealthMetric {
    const profile = profiles[this.profile];
    
    // Вес медленно изменяется (небольшие ежедневные колебания)
    const dailyChange = randomNormal(0, 0.3); // ±0.3 кг в день
    this.currentWeight += dailyChange;

    const [min, max] = profile.weight.range;
    this.currentWeight = Math.max(min, Math.min(max, this.currentWeight));

    return {
      metric_type: 'weight',
      value: Math.round(this.currentWeight * 10) / 10, // 1 знак после запятой
      timestamp: date,
      source: 'simulation',
    };
  }

  generateBMI(weight: number, height: number = 175): HealthMetric {
    // BMI = weight (kg) / (height (m))^2
    const heightMeters = height / 100;
    const bmi = weight / (heightMeters * heightMeters);

    return {
      metric_type: 'bmi',
      value: Math.round(bmi * 10) / 10,
      timestamp: new Date(),
      source: 'simulation',
    };
  }

  getCurrentWeight(): number {
    return this.currentWeight;
  }
}

