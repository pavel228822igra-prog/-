import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { HealthMetricCard } from '../components/HealthMetricCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useStore } from '../store/useStore';
import { getLatestHealthMetric, getGoals } from '../database/database';
import { HealthMetric, Goal, MetricType } from '../types';
import { colors } from '../utils/colors';
import { getMetricLabel, getMetricIcon } from '../utils/format';

const allMetrics: MetricType[] = [
  'heart_rate',
  'steps',
  'distance',
  'weight',
  'bmi',
  'water',
  'calories',
  'sleep_duration',
  'sleep_quality',
  'breathing_rate',
  'stress_level',
  'activity',
];

export const HealthMetricsScreen: React.FC = () => {
  const isDark = useStore(state => state.isDarkMode);
  const [metrics, setMetrics] = useState<Map<MetricType, HealthMetric>>(new Map());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = isDark ? colors.dark : colors.light;

  const loadData = async () => {
    try {
      setLoading(true);

      const metricsMap = new Map<MetricType, HealthMetric>();
      for (const metricType of allMetrics) {
        const latest = await getLatestHealthMetric(metricType);
        if (latest) {
          metricsMap.set(metricType, latest);
        }
      }

      const goalsList = await getGoals();

      setMetrics(metricsMap);
      setGoals(goalsList);
    } catch (error) {
      console.error('Error loading health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner isDark={isDark} />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Показатели здоровья
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Все ваши метрики в одном месте
        </Text>
      </View>

      <View style={styles.metricsList}>
        {allMetrics.map(metricType => {
          const metric = metrics.get(metricType);
          const goal = goals.find(g => g.type === metricType);

          if (!metric) {
            return (
              <View
                key={metricType}
                style={[styles.emptyCard, { backgroundColor: theme.surface }]}
              >
                <Text style={styles.icon}>{getMetricIcon(metricType)}</Text>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  {getMetricLabel(metricType)} - нет данных
                </Text>
              </View>
            );
          }

          return (
            <HealthMetricCard
              key={metricType}
              type={metricType}
              value={metric.value}
              goal={goal}
              isDark={isDark}
            />
          );
        })}
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
  metricsList: {
    padding: 20,
    paddingTop: 10,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  emptyText: {
    fontSize: 14,
  },
});

