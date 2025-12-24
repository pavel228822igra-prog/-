import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { RecommendationCard } from '../components/RecommendationCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useStore } from '../store/useStore';
import {
  getRecommendations,
  updateRecommendation,
  clearAllRecommendations,
} from '../database/database';
import { Recommendation } from '../types';
import { colors } from '../utils/colors';
import { RecommendationEngine } from '../services/recommendations';
import { insertRecommendation } from '../database/database';

export const RecommendationsScreen: React.FC = () => {
  const isDark = useStore(state => state.isDarkMode);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [completedRecommendations, setCompletedRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const theme = isDark ? colors.dark : colors.light;

  const loadRecommendations = async () => {
    try {
      setLoading(true);

      const active = await getRecommendations(false);
      const completed = await getRecommendations(true);

      setRecommendations(active);
      setCompletedRecommendations(completed);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewRecommendations = async () => {
    try {
      const engine = new RecommendationEngine();
      const newRecs = await engine.generateRecommendations();

      for (const rec of newRecs) {
        await insertRecommendation(rec);
      }

      await loadRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  const handleComplete = async (id: number) => {
    await updateRecommendation(id, true);
    await loadRecommendations();
  };

  useEffect(() => {
    loadRecommendations();
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
          Рекомендации
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Персонализированные советы для вашего здоровья
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={generateNewRecommendations}
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.actionButtonText}>Обновить рекомендации</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowCompleted(!showCompleted)}
          style={[styles.toggleButton, { backgroundColor: theme.surface }]}
        >
          <Text style={[styles.toggleButtonText, { color: theme.text }]}>
            {showCompleted ? 'Скрыть выполненные' : 'Показать выполненные'}
          </Text>
        </TouchableOpacity>
      </View>

      {recommendations.length === 0 && !showCompleted && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Нет активных рекомендаций
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Нажмите "Обновить рекомендации" для генерации новых советов
          </Text>
        </View>
      )}

      {recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Активные рекомендации
          </Text>
          {recommendations.map((rec, index) => (
            <RecommendationCard
              key={rec.id || index}
              recommendation={rec}
              isDark={isDark}
              onComplete={handleComplete}
            />
          ))}
        </View>
      )}

      {showCompleted && completedRecommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Выполненные рекомендации
          </Text>
          {completedRecommendations.map((rec, index) => (
            <RecommendationCard
              key={rec.id || index}
              recommendation={rec}
              isDark={isDark}
            />
          ))}
        </View>
      )}

      {showCompleted && completedRecommendations.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Нет выполненных рекомендаций
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
  actions: {
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

