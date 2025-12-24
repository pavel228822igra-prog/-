import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useStore } from '../store/useStore';
import { getHealthMetrics } from '../database/database';
import { HealthMetric } from '../types';
import { colors } from '../utils/colors';
import { formatMetricValue, getMetricLabel, getMetricIcon } from '../utils/format';
import { format, subDays } from 'date-fns';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ActivityLogScreen: React.FC = () => {
  const isDark = useStore(state => state.isDarkMode);
  const [activities, setActivities] = useState<Map<string, HealthMetric[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const theme = isDark ? colors.dark : colors.light;

  const loadActivities = async () => {
    try {
      setLoading(true);

      const endDate = new Date();
      const startDate = subDays(endDate, days);

      const metrics = await getHealthMetrics(undefined, startDate, endDate);

      // Группируем по датам
      const grouped = new Map<string, HealthMetric[]>();

      metrics.forEach(metric => {
        const dateKey = format(new Date(metric.timestamp), 'yyyy-MM-dd');
        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, []);
        }
        grouped.get(dateKey)!.push(metric);
      });

      // Сортируем по дате (новые сначала)
      const sorted = new Map(
        Array.from(grouped.entries()).sort((a, b) => b[0].localeCompare(a[0]))
      );

      setActivities(sorted);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [days]);

  if (loading) {
    return <LoadingSpinner isDark={isDark} />;
  }

  const renderActivityItem = (metric: HealthMetric) => {
    return (
      <View
        key={`${metric.metric_type}-${metric.timestamp}`}
        style={[styles.activityItem, { backgroundColor: theme.surface }]}
      >
        <Text style={styles.icon}>{getMetricIcon(metric.metric_type)}</Text>
        <View style={styles.activityContent}>
          <Text style={[styles.activityLabel, { color: theme.text }]}>
            {getMetricLabel(metric.metric_type)}
          </Text>
          <Text style={[styles.activityValue, { color: theme.textSecondary }]}>
            {formatMetricValue(metric.metric_type, metric.value)}
          </Text>
        </View>
        <Text style={[styles.activityTime, { color: theme.textSecondary }]}>
          {format(new Date(metric.timestamp), 'HH:mm')}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Журнал активности
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          История всех записей
        </Text>
      </View>

      <View style={styles.controls}>
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

      {Array.from(activities.entries()).map(([date, metrics]) => (
        <View key={date} style={styles.daySection}>
          <View style={styles.dayHeader}>
            <Text style={[styles.dayTitle, { color: theme.text }]}>
              {format(new Date(date), 'dd MMMM yyyy', { locale: undefined })}
            </Text>
            <Text style={[styles.daySubtitle, { color: theme.textSecondary }]}>
              {metrics.length} записей
            </Text>
          </View>

          {metrics
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map(metric => renderActivityItem(metric))}
        </View>
      ))}

      {activities.size === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Нет данных за выбранный период
          </Text>
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
  controls: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
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
  daySection: {
    padding: 20,
    paddingTop: 10,
  },
  dayHeader: {
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  daySubtitle: {
    fontSize: 14,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityValue: {
    fontSize: 14,
  },
  activityTime: {
    fontSize: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

