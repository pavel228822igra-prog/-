import { UserProfile, HealthMetric } from '../types';
import { HeartRateSimulator } from './heartRate';
import { StepSimulator } from './steps';
import { SleepSimulator } from './sleep';
import { WeightSimulator } from './weight';
import { WaterSimulator } from './water';
import { CalorieSimulator } from './calories';

export class HealthDataSimulator {
  private profile: UserProfile;
  private heartRateSim: HeartRateSimulator;
  private stepSim: StepSimulator;
  private sleepSim: SleepSimulator;
  private weightSim: WeightSimulator;
  private waterSim: WaterSimulator;
  private calorieSim: CalorieSimulator;

  constructor(profile: UserProfile = 'active') {
    this.profile = profile;
    this.heartRateSim = new HeartRateSimulator(profile);
    this.stepSim = new StepSimulator(profile);
    this.sleepSim = new SleepSimulator(profile);
    this.weightSim = new WeightSimulator(profile);
    this.waterSim = new WaterSimulator(profile);
    this.calorieSim = new CalorieSimulator(profile);
  }

  setProfile(profile: UserProfile): void {
    this.profile = profile;
    this.heartRateSim = new HeartRateSimulator(profile);
    this.stepSim = new StepSimulator(profile);
    this.sleepSim = new SleepSimulator(profile);
    this.weightSim = new WeightSimulator(profile);
    this.waterSim = new WaterSimulator(profile);
    this.calorieSim = new CalorieSimulator(profile);
  }

  generateDailyData(date: Date = new Date(), source: string = 'simulation'): HealthMetric[] {
    const data: HealthMetric[] = [];

    // Генерируем данные для всех метрик
    const heartRateData = this.heartRateSim.generateDailyData(date);
    heartRateData.forEach(metric => {
      metric.source = source;
      data.push(metric);
    });

    const stepsData = this.stepSim.generateDailySteps(date);
    stepsData.source = source;

    const distanceData = this.stepSim.generateDistanceFromSteps(stepsData.value);
    distanceData.source = source;
    data.push(distanceData);

    const sleepData = this.sleepSim.generateSleepData(date);
    sleepData.forEach(metric => {
      metric.source = source;
      data.push(metric);
    });

    const weightData = this.weightSim.generateWeightReading(date);
    weightData.source = source;
    data.push(weightData);

    const waterData = this.waterSim.generateDailyWater(date);
    waterData.source = source;
    data.push(waterData);

    const caloriesData = this.calorieSim.generateDailyCalories(date);
    caloriesData.source = source;
    data.push(caloriesData);

    // Дополнительные метрики
    const breathingRate: HealthMetric = {
      metric_type: 'breathing_rate',
      value: Math.round(Math.random() * 5 + 12), // 12-17 дыханий в минуту
      timestamp: date,
      source: source,
    };
    data.push(breathingRate);

    const stressLevel: HealthMetric = {
      metric_type: 'stress_level',
      value: Math.round(Math.random() * 40 + 20), // 20-60 (0-100 шкала)
      timestamp: date,
      source: source,
    };
    data.push(stressLevel);

    return data;
  }

  generateCurrentReadings(source: string = 'simulation'): HealthMetric[] {
    const now = new Date();
    const readings = [
      this.heartRateSim.generateSingleReading(now),
      this.stepSim.generateDailySteps(now),
      this.waterSim.generateDailyWater(now),
      this.calorieSim.generateDailyCalories(now),
    ];
    readings.forEach(metric => {
      metric.source = source;
    });
    return readings;
  }
}

