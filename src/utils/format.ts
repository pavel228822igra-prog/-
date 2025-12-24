import { MetricType } from '../types';

export const formatMetricValue = (type: MetricType, value: number): string => {
  switch (type) {
    case 'heart_rate':
      return `${Math.round(value)} bpm`;
    case 'steps':
      return `${Math.round(value).toLocaleString()}`;
    case 'distance':
      return `${value.toFixed(2)} km`;
    case 'weight':
      return `${value.toFixed(1)} kg`;
    case 'bmi':
      return value.toFixed(1);
    case 'water':
      return `${Math.round(value)} ml`;
    case 'calories':
      return `${Math.round(value)} kcal`;
    case 'sleep_duration':
      return `${value.toFixed(1)} ч`;
    case 'sleep_quality':
      return `${Math.round(value)}%`;
    case 'breathing_rate':
      return `${Math.round(value)}/мин`;
    case 'stress_level':
      return `${Math.round(value)}/100`;
    default:
      return value.toString();
  }
};

export const getMetricLabel = (type: MetricType): string => {
  const labels: Record<MetricType, string> = {
    heart_rate: 'ЧСС',
    steps: 'Шаги',
    distance: 'Дистанция',
    weight: 'Вес',
    bmi: 'ИМТ',
    water: 'Вода',
    calories: 'Калории',
    sleep_duration: 'Сон',
    sleep_quality: 'Качество сна',
    breathing_rate: 'Дыхание',
    stress_level: 'Стресс',
    activity: 'Активность',
  };
  return labels[type] || type;
};

export const getMetricIcon = (type: MetricType): string => {
  const icons: Record<MetricType, string> = {
    heart_rate: '❤️',
    steps: '👣',
    distance: '📍',
    weight: '⚖️',
    bmi: '📊',
    water: '💧',
    calories: '🔥',
    sleep_duration: '😴',
    sleep_quality: '🌙',
    breathing_rate: '🫁',
    stress_level: '🧘',
    activity: '🏃',
  };
  return icons[type] || '📈';
};

