import { UserProfile, HealthMetric } from '../types';
import { profiles, randomNormal } from './base';

export class SleepSimulator {
  private profile: UserProfile;

  constructor(profile: UserProfile = 'active') {
    this.profile = profile;
  }

  generateSleepData(date: Date = new Date()): HealthMetric[] {
    const profile = profiles[this.profile];
    const [min, max] = profile.sleep.range;
    
    // Генерируем продолжительность сна
    let duration = randomNormal(profile.sleep.base, 0.5);
    duration = Math.max(min, Math.min(max, duration));

    // Качество сна (0-100)
    let quality = randomNormal(75, 10);
    quality = Math.max(50, Math.min(100, quality));

    // Корреляция: больше сна = лучше качество
    if (duration > profile.sleep.base) {
      quality += 5;
    }

    const sleepDate = new Date(date);
    sleepDate.setHours(0, 0, 0, 0);
    sleepDate.setDate(sleepDate.getDate() - 1); // Сон предыдущей ночи

    return [
      {
        metric_type: 'sleep_duration',
        value: Math.round(duration * 10) / 10, // 1 знак после запятой
        timestamp: sleepDate,
        source: 'simulation',
      },
      {
        metric_type: 'sleep_quality',
        value: Math.round(quality),
        timestamp: sleepDate,
        source: 'simulation',
      },
    ];
  }
}

