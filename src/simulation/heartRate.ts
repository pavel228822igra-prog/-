import { UserProfile, HealthMetric } from '../types';
import { profiles, randomNormal, getTimeOfDayMultiplier } from './base';

export class HeartRateSimulator {
  private profile: UserProfile;

  constructor(profile: UserProfile = 'active') {
    this.profile = profile;
  }

  generateDailyData(date: Date = new Date()): HealthMetric[] {
    const profile = profiles[this.profile];
    const data: HealthMetric[] = [];
    const baseRate = profile.heartRate.base;
    const [min, max] = profile.heartRate.range;

    // Генерируем данные каждый час
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(date);
      timestamp.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

      const timeMultiplier = getTimeOfDayMultiplier(timestamp);
      let rate = baseRate * timeMultiplier;

      // Добавляем случайные колебания
      rate += randomNormal(0, 5);

      // Ограничиваем диапазоном
      rate = Math.max(min, Math.min(max, rate));

      // Случайные "тренировки" (высокий пульс)
      if (Math.random() < 0.1 && hour >= 8 && hour <= 20) {
        rate = randomNormal(baseRate + 30, 10);
        rate = Math.min(max + 20, rate);
      }

      data.push({
        metric_type: 'heart_rate',
        value: Math.round(rate),
        timestamp,
        source: 'simulation',
      });
    }

    return data;
  }

  generateSingleReading(date: Date = new Date()): HealthMetric {
    const profile = profiles[this.profile];
    const baseRate = profile.heartRate.base;
    const [min, max] = profile.heartRate.range;

    const timeMultiplier = getTimeOfDayMultiplier(date);
    let rate = baseRate * timeMultiplier;
    rate += randomNormal(0, 5);
    rate = Math.max(min, Math.min(max, rate));

    return {
      metric_type: 'heart_rate',
      value: Math.round(rate),
      timestamp: date,
      source: 'simulation',
    };
  }
}

