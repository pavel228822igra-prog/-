import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MetricType, Goal } from '../types';
import { formatMetricValue, getMetricLabel, getMetricIcon } from '../utils/format';
import { colors } from '../utils/colors';
import { metricColors } from '../utils/colors';

interface HealthMetricCardProps {
  type: MetricType;
  value: number;
  goal?: Goal;
  trend?: 'up' | 'down' | 'stable';
  onPress?: () => void;
  isDark?: boolean;
}

export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  type,
  value,
  goal,
  trend,
  onPress,
  isDark = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onPress?.();
  };

  const theme = isDark ? colors.dark : colors.light;
  const metricColor = metricColors[type] || theme.primary;
  
  const progress = goal && goal.target_value > 0 
    ? Math.min((value / goal.target_value) * 100, 100)
    : null;

  const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
      style={[styles.card, { backgroundColor: theme.surface }]}
    >
      <Animated.View style={animatedStyle}>
        <View style={styles.header}>
          <Text style={styles.icon}>{getMetricIcon(type)}</Text>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {getMetricLabel(type)}
          </Text>
        </View>

        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: theme.text }]}>
            {formatMetricValue(type, value)}
          </Text>
          {trend && (
            <Text style={styles.trendIcon}>{trendIcon}</Text>
          )}
        </View>

        {goal && progress !== null && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                    backgroundColor: progress >= 100 ? theme.success : metricColor,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
              {progress.toFixed(0)}% от цели ({formatMetricValue(type, goal.target_value)})
            </Text>
          </View>
        )}

        {!goal && (
          <View style={styles.noGoalContainer}>
            <Text style={[styles.noGoalText, { color: theme.textSecondary }]}>
              Цель не установлена
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 8,
  },
  trendIcon: {
    fontSize: 20,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
  },
  noGoalContainer: {
    marginTop: 8,
  },
  noGoalText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

