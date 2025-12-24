import { UserProfile, HealthMetric } from '../types';
import { profiles, randomInRange } from './base';

export class WaterSimulator {
  private profile: UserProfile;

  constructor(profile: UserProfile = 'active') {
    this.profile = profile;
  }

  generateDailyWater(date: Date = new Date()): HealthMetric {
    const profile = profiles[this.profile];
    const [min, max] = profile.water.range;
    
    let water = randomInRange(min, max);

    // Учитываем активность (в дни с большей активностью больше воды)
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      water *= 1.1; // На 10% больше в будни
    }

    return {
      metric_type: 'water',
      value: Math.round(water),
      timestamp: date,
      source: 'simulation',
    };
  }
}

