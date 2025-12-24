import { UserProfile, HealthMetric } from '../types';
import { profiles, randomInRange } from './base';

export class StepSimulator {
  private profile: UserProfile;

  constructor(profile: UserProfile = 'active') {
    this.profile = profile;
  }

  generateDailySteps(date: Date = new Date()): HealthMetric {
    const profile = profiles[this.profile];
    const [min, max] = profile.steps.range;
    
    // Базовое значение с вариациями
    let steps = randomInRange(min, max);
    
    // Учитываем день недели (выходные обычно меньше активности)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      steps *= 0.7; // 30% меньше в выходные
    }

    // Добавляем случайные всплески активности
    if (Math.random() < 0.2) {
      steps *= 1.3; // 30% больше в активные дни
    }

    return {
      metric_type: 'steps',
      value: Math.round(steps),
      timestamp: date,
      source: 'simulation',
    };
  }

  generateDistanceFromSteps(steps: number): HealthMetric {
    // Средняя длина шага ~0.7 метров
    const distanceMeters = steps * 0.0007; // в километрах
    
    return {
      metric_type: 'distance',
      value: Math.round(distanceMeters * 100) / 100, // 2 знака после запятой
      timestamp: new Date(),
      source: 'simulation',
    };
  }
}

