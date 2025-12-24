import { UserProfile, HealthMetric } from '../types';
import { profiles, randomInRange } from './base';

export class CalorieSimulator {
  private profile: UserProfile;

  constructor(profile: UserProfile = 'active') {
    this.profile = profile;
  }

  generateDailyCalories(date: Date = new Date()): HealthMetric {
    const profile = profiles[this.profile];
    const [min, max] = profile.calories.range;
    
    let calories = randomInRange(min, max);

    // Выходные могут быть более калорийными
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      calories *= 1.05;
    }

    return {
      metric_type: 'calories',
      value: Math.round(calories),
      timestamp: date,
      source: 'simulation',
    };
  }
}

