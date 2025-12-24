import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory-native';
import { TrendData } from '../types';
import { colors } from '../utils/colors';
import { formatMetricValue, getMetricLabel } from '../utils/format';
import { MetricType } from '../types';

interface TrendChartProps {
  data: TrendData[];
  metricType: MetricType;
  isDark?: boolean;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  metricType,
  isDark = false,
}) => {
  const theme = isDark ? colors.dark : colors.light;

  if (data.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Нет данных для отображения
        </Text>
      </View>
    );
  }

  // Преобразуем данные для Victory Chart
  const chartData = data.map((item, index) => ({
    x: index + 1,
    y: item.value,
    date: item.date,
  }));

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const yDomain: [number, number] = [
    Math.max(0, minValue - range * 0.1),
    maxValue + range * 0.1,
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {getMetricLabel(metricType)}
      </Text>
      <VictoryChart
        theme={VictoryTheme.material}
        height={200}
        padding={{ left: 50, right: 20, top: 20, bottom: 40 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: theme.textSecondary },
            tickLabels: { fill: theme.textSecondary, fontSize: 10 },
            grid: { stroke: theme.border, strokeDasharray: '5,5' },
          }}
        />
        <VictoryAxis
          dependentAxis
          domain={yDomain}
          style={{
            axis: { stroke: theme.textSecondary },
            tickLabels: { fill: theme.textSecondary, fontSize: 10 },
            grid: { stroke: theme.border, strokeDasharray: '5,5' },
          }}
        />
        <VictoryLine
          data={chartData}
          style={{
            data: { stroke: theme.primary, strokeWidth: 2 },
          }}
          interpolation="natural"
        />
      </VictoryChart>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Макс</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {formatMetricValue(metricType, maxValue)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Мин</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {formatMetricValue(metricType, minValue)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Среднее</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {formatMetricValue(
              metricType,
              data.reduce((sum, d) => sum + d.value, 0) / data.length
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    padding: 40,
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

