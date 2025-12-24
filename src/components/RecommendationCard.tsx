import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Recommendation } from '../types';
import { colors } from '../utils/colors';
import { categoryColors } from '../utils/colors';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onComplete?: (id: number) => void;
  isDark?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onComplete,
  isDark = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    if (!recommendation.completed && recommendation.id) {
      scale.value = withSpring(0.95, {}, () => {
        scale.value = withSpring(1);
      });
      onComplete?.(recommendation.id);
    }
  };

  const theme = isDark ? colors.dark : colors.light;
  const categoryColor = categoryColors[recommendation.category] || theme.primary;

  const categoryIcons: Record<string, string> = {
    exercise: '🏃',
    nutrition: '🍎',
    sleep: '😴',
    general: '💡',
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={recommendation.completed}
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          opacity: recommendation.completed ? 0.6 : 1,
        },
      ]}
    >
      <Animated.View style={animatedStyle}>
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryIcon}>
              {categoryIcons[recommendation.category] || '💡'}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.text }]}>
              {recommendation.completed ? '✓ ' : ''}
              {recommendation.title}
            </Text>
            <Text style={[styles.category, { color: theme.textSecondary }]}>
              {recommendation.category}
            </Text>
          </View>
        </View>

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {recommendation.description}
        </Text>

        {!recommendation.completed && (
          <View style={styles.footer}>
            <Text style={[styles.actionText, { color: categoryColor }]}>
              Нажмите, чтобы отметить выполненным
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
    marginBottom: 12,
  },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

