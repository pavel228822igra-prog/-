import { Recommendation, HealthMetric, MetricType, Goal } from '../types';
import { getHealthMetrics, getGoals } from '../database/database';
import { format, subDays } from 'date-fns';

export class RecommendationEngine {
  async generateRecommendations(): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Анализ шагов
    const stepsRecommendation = await this.analyzeSteps();
    if (stepsRecommendation) recommendations.push(stepsRecommendation);

    // Анализ воды
    const waterRecommendation = await this.analyzeWater();
    if (waterRecommendation) recommendations.push(waterRecommendation);

    // Анализ сна
    const sleepRecommendation = await this.analyzeSleep();
    if (sleepRecommendation) recommendations.push(sleepRecommendation);

    // Анализ веса
    const weightRecommendation = await this.analyzeWeight();
    if (weightRecommendation) recommendations.push(weightRecommendation);

    // Анализ активности
    const activityRecommendation = await this.analyzeActivity();
    if (activityRecommendation) recommendations.push(activityRecommendation);

    return recommendations;
  }

  private async analyzeSteps(): Promise<Recommendation | null> {
    const today = new Date();
    const weekAgo = subDays(today, 7);
    
    const stepsData = await getHealthMetrics('steps', weekAgo, today);
    if (stepsData.length === 0) return null;

    const avgSteps = stepsData.reduce((sum, m) => sum + m.value, 0) / stepsData.length;
    const goals = await getGoals();
    const stepGoal = goals.find(g => g.type === 'steps');

    if (stepGoal && avgSteps < stepGoal.target_value * 0.8) {
      const increase = Math.round(stepGoal.target_value * 0.15);
      return {
        title: 'Увеличьте дневную активность',
        description: `Ваша средняя активность составляет ${Math.round(avgSteps)} шагов. Рекомендуем увеличить на ${increase} шагов для достижения цели.`,
        category: 'exercise',
        priority: 2,
        completed: false,
      };
    }

    if (avgSteps < 5000) {
      return {
        title: 'Больше двигайтесь',
        description: 'Ваша активность ниже рекомендуемой нормы. Старайтесь делать хотя бы 5000 шагов в день.',
        category: 'exercise',
        priority: 3,
        completed: false,
      };
    }

    return null;
  }

  private async analyzeWater(): Promise<Recommendation | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const waterData = await getHealthMetrics('water', today, new Date());
    if (waterData.length === 0) return null;

    const todayWater = waterData.reduce((sum, m) => sum + m.value, 0);
    const recommendedWater = 2000; // 2 литра

    if (todayWater < recommendedWater * 0.7) {
      const needed = recommendedWater - todayWater;
      return {
        title: 'Пейте больше воды',
        description: `Вы выпили ${Math.round(todayWater)}мл сегодня. Рекомендуется выпить еще ${Math.round(needed)}мл для достижения дневной нормы.`,
        category: 'nutrition',
        priority: 2,
        completed: false,
      };
    }

    return null;
  }

  private async analyzeSleep(): Promise<Recommendation | null> {
    const today = new Date();
    const weekAgo = subDays(today, 7);
    
    const sleepData = await getHealthMetrics('sleep_duration', weekAgo, today);
    if (sleepData.length === 0) return null;

    const avgSleep = sleepData.reduce((sum, m) => sum + m.value, 0) / sleepData.length;
    const recommendedSleep = 7.5;

    if (avgSleep < recommendedSleep - 1) {
      const deficit = recommendedSleep - avgSleep;
      return {
        title: 'Улучшите режим сна',
        description: `Ваша средняя продолжительность сна ${avgSleep.toFixed(1)} часов. Рекомендуем ложиться на ${Math.round(deficit * 60)} минут раньше для полноценного отдыха.`,
        category: 'sleep',
        priority: 2,
        completed: false,
      };
    }

    return null;
  }

  private async analyzeWeight(): Promise<Recommendation | null> {
    const today = new Date();
    const monthAgo = subDays(today, 30);
    
    const weightData = await getHealthMetrics('weight', monthAgo, today);
    if (weightData.length < 2) return null;

    const sorted = weightData.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const oldWeight = sorted[0].value;
    const newWeight = sorted[sorted.length - 1].value;
    const change = newWeight - oldWeight;

    if (Math.abs(change) > 2) {
      const direction = change > 0 ? 'увеличение' : 'снижение';
      return {
        title: `Изменение веса: ${direction}`,
        description: `За последний месяц ваш вес изменился на ${Math.abs(change).toFixed(1)} кг. Рекомендуем проконсультироваться со специалистом.`,
        category: 'general',
        priority: 1,
        completed: false,
      };
    }

    return null;
  }

  private async analyzeActivity(): Promise<Recommendation | null> {
    const today = new Date();
    const weekAgo = subDays(today, 7);
    
    const stepsData = await getHealthMetrics('steps', weekAgo, today);
    const heartRateData = await getHealthMetrics('heart_rate', weekAgo, today);
    
    if (stepsData.length === 0 || heartRateData.length === 0) return null;

    const avgSteps = stepsData.reduce((sum, m) => sum + m.value, 0) / stepsData.length;
    const avgHeartRate = heartRateData.reduce((sum, m) => sum + m.value, 0) / heartRateData.length;

    // Если низкая активность и низкий пульс - рекомендовать тренировки
    if (avgSteps < 6000 && avgHeartRate < 70) {
      return {
        title: 'Начните регулярные тренировки',
        description: 'Ваши показатели указывают на низкую активность. Регулярные тренировки улучшат ваше здоровье и настроение.',
        category: 'exercise',
        priority: 2,
        completed: false,
      };
    }

    return null;
  }
}

