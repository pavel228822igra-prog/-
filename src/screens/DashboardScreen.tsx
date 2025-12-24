import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useStore } from '../store/useStore';
import { HealthMetricCard } from '../components/HealthMetricCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  getLatestHealthMetric,
  getGoals,
  getRecommendations,
} from '../database/database';
import { HealthMetric, Goal, Recommendation, MetricType } from '../types';
import { colors } from '../utils/colors';
import { formatMetricValue, getMetricLabel } from '../utils/format';

const keyMetrics: MetricType[] = [
  'steps',
  'heart_rate',
  'sleep_duration',
  'water',
  'calories',
  'weight',
];

export const DashboardScreen: React.FC = () => {
  const isDark = useStore(state => state.isDarkMode);
  const [metrics, setMetrics] = useState<Map<MetricType, HealthMetric>>(new Map());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const theme = isDark ? colors.dark : colors.light;

  const loadData = async () => {
    try {
      setLoading(true);

      // Загружаем последние значения метрик
      const metricsMap = new Map<MetricType, HealthMetric>();
      for (const metricType of keyMetrics) {
        const latest = await getLatestHealthMetric(metricType);
        if (latest) {
          metricsMap.set(metricType, latest);
        }
      }

      // Загружаем цели
      const goalsList = await getGoals();

      // Загружаем рекомендации (только невыполненные)
      const recommendationsList = await getRecommendations(false);

      setMetrics(metricsMap);
      setGoals(goalsList);
      setRecommendations(recommendationsList.slice(0, 3)); // Показываем только первые 3
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Панель управления
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Обзор вашего здоровья
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Ключевые показатели
        </Text>
        {keyMetrics.map(metricType => {
          const metric = metrics.get(metricType);
          const goal = goals.find(g => g.type === metricType);

          if (!metric) return null;

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

      {recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Рекомендации
          </Text>
          {recommendations.map((rec, index) => (
            <RecommendationCard
              key={index}
              recommendation={rec}
              isDark={isDark}
              onComplete={async (id) => {
                const { updateRecommendation } = await import('../database/database');
                await updateRecommendation(id, true);
                await loadData();
              }}
            />
          ))}
        </View>
      )}
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
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

