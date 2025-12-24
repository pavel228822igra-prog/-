import { HealthDataSimulator } from '../simulation';
import { insertHealthMetric, getLatestHealthMetric } from '../database/database';
import { UserProfile, DataSource } from '../types';

export class SimulationService {
  private simulator: HealthDataSimulator;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private dataSource: DataSource = 'simulation';

  constructor(profile: UserProfile = 'active') {
    this.simulator = new HealthDataSimulator(profile);
  }

  setProfile(profile: UserProfile): void {
    this.simulator.setProfile(profile);
  }

  setDataSource(source: DataSource): void {
    this.dataSource = source;
  }

  getDataSource(): string {
    return this.dataSource === 'imsit_watch' ? 'IMSIT Watch' :
           this.dataSource === 'device' ? 'Device' :
           'Simulation';
  }

  async generateInitialData(days: number = 7): Promise<void> {
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(12, 0, 0, 0);

      const source = this.getDataSource();
      const data = this.simulator.generateDailyData(date, source);
      
      for (const metric of data) {
        await insertHealthMetric(metric);
      }
    }
  }

  startAutoSimulation(intervalMinutes: number = 60): void {
    if (this.isRunning) {
      this.stopAutoSimulation();
    }

    this.isRunning = true;
    const intervalMs = intervalMinutes * 60 * 1000;

    // Генерируем данные сразу
    this.generateAndSaveCurrentData();

    // Затем по расписанию
    this.intervalId = setInterval(() => {
      this.generateAndSaveCurrentData();
    }, intervalMs);
  }

  stopAutoSimulation(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  private async generateAndSaveCurrentData(): Promise<void> {
    try {
      const source = this.getDataSource();
      const readings = this.simulator.generateCurrentReadings(source);
      
      for (const reading of readings) {
        // Проверяем, есть ли уже данные за этот день для этой метрики
        const latest = await getLatestHealthMetric(reading.metric_type);
        
        if (latest) {
          const latestDate = new Date(latest.timestamp);
          const readingDate = new Date(reading.timestamp);
          
          // Если данные уже есть за сегодня, обновляем только некоторые метрики
          if (
            latestDate.toDateString() === readingDate.toDateString() &&
            (reading.metric_type === 'heart_rate' || reading.metric_type === 'steps')
          ) {
            await insertHealthMetric(reading);
          } else if (latestDate.toDateString() !== readingDate.toDateString()) {
            await insertHealthMetric(reading);
          }
        } else {
          await insertHealthMetric(reading);
        }
      }
    } catch (error) {
      console.error('Error generating simulation data:', error);
    }
  }

  async generateTodayData(): Promise<void> {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    
    const source = this.getDataSource();
    const data = this.simulator.generateDailyData(today, source);
    
    for (const metric of data) {
      await insertHealthMetric(metric);
    }
  }

  isSimulationRunning(): boolean {
    return this.isRunning;
  }
}

