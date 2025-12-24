import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { TrendChart } from '../components/TrendChart';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useStore } from '../store/useStore';
import { getHealthMetrics } from '../database/database';
import { TrendData, MetricType } from '../types';
import { colors } from '../utils/colors';
import { format, subDays } from 'date-fns';

const chartMetrics: MetricType[] = [
  'heart_rate',
  'steps',
  'sleep_duration',
  'weight',
  'water',
  'calories',
];

export const AnalyticsScreen: React.FC = () => {
  const isDark = useStore(state => state.isDarkMode);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('steps');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  const theme = isDark ? colors.dark : colors.light;

  const loadTrendData = async () => {
    try {
      setLoading(true);

      const endDate = new Date();
      const startDate = subDays(endDate, days);

      const metrics = await getHealthMetrics(selectedMetric, startDate, endDate);

      // Группируем по дням и берем среднее значение
      const groupedByDay = new Map<string, number[]>();

      metrics.forEach(metric => {
        const dateKey = format(new Date(metric.timestamp), 'yyyy-MM-dd');
        if (!groupedByDay.has(dateKey)) {
          groupedByDay.set(dateKey, []);
        }
        groupedByDay.get(dateKey)!.push(metric.value);
      });

      const trend: TrendData[] = Array.from(groupedByDay.entries())
        .map(([date, values]) => ({
          date,
          value: values.reduce((sum, v) => sum + v, 0) / values.length,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setTrendData(trend);
    } catch (error) {
      console.error('Error loading trend data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrendData();
  }, [selectedMetric, days]);

  if (loading) {
    return <LoadingSpinner isDark={isDark} />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Аналитика</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Тренды и тенденции
        </Text>
      </View>

      <View style={styles.controls}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chartMetrics.map(metric => (
            <TouchableOpacity
              key={metric}
              onPress={() => setSelectedMetric(metric)}
              style={[
                styles.metricButton,
                {
                  backgroundColor:
                    selectedMetric === metric ? theme.primary : theme.surface,
                },
              ]}
            >
              <Text
                style={[
                  styles.metricButtonText,
                  {
                    color:
                      selectedMetric === metric ? '#FFFFFF' : theme.text,
                  },
                ]}
              >
                {metric === 'heart_rate' ? 'ЧСС' :
                 metric === 'sleep_duration' ? 'Сон' :
                 metric === 'weight' ? 'Вес' :
                 metric === 'water' ? 'Вода' :
                 metric === 'calories' ? 'Калории' : 'Шаги'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.daysSelector}>
          {[7, 14, 30].map(dayCount => (
            <TouchableOpacity
              key={dayCount}
              onPress={() => setDays(dayCount)}
              style={[
                styles.dayButton,
                {
                  backgroundColor: days === dayCount ? theme.primary : theme.surface,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  {
                    color: days === dayCount ? '#FFFFFF' : theme.text,
                  },
                ]}
              >
                {dayCount} дн.
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.chartContainer}>
        <TrendChart
          data={trendData}
          metricType={selectedMetric}
          isDark={isDark}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  controls: {
    padding: 20,
    paddingTop: 10,
  },
  metricButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  metricButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  daysSelector: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartContainer: {
    padding: 20,
    paddingTop: 0,
  },
});

