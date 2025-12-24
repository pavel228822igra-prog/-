export type MetricType = 
  | 'heart_rate'
  | 'steps'
  | 'distance'
  | 'weight'
  | 'bmi'
  | 'water'
  | 'calories'
  | 'sleep_duration'
  | 'sleep_quality'
  | 'breathing_rate'
  | 'stress_level'
  | 'activity';

export interface HealthMetric {
  id?: number;
  metric_type: MetricType;
  value: number;
  timestamp: Date | string;
  source?: string;
}

export interface Goal {
  id?: number;
  type: MetricType;
  target_value: number;
  current_value?: number;
  deadline?: Date | string | null;
  achieved?: boolean;
}

export interface Recommendation {
  id?: number;
  title: string;
  description: string;
  category: 'exercise' | 'nutrition' | 'sleep' | 'general';
  priority: number;
  completed?: boolean;
  created_at?: Date | string;
}

export type UserProfile = 
  | 'sedentary'
  | 'active'
  | 'athlete'
  | 'recovery';

export type DataSource = 'simulation' | 'device' | 'imsit_watch';

export interface SimulationConfig {
  profile: UserProfile;
  intensity: number; // 0-100
  enabled: boolean;
  dataSource: DataSource;
}

export interface TrendData {
  date: Date | string;
  value: number;
  average?: number;
}

export interface DashboardData {
  metrics: {
    [key in MetricType]?: {
      current: number;
      goal?: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
  recommendations: Recommendation[];
  achievements: string[];
}

