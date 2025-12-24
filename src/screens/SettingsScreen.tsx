import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useStore } from '../store/useStore';
import { colors } from '../utils/colors';
import { UserProfile, DataSource } from '../types';
import { SimulationService } from '../services/simulationService';
import { initDatabase } from '../database/database';

const profiles: { label: string; value: UserProfile; description: string }[] = [
  { label: 'Сидячий образ жизни', value: 'sedentary', description: 'Низкая активность' },
  { label: 'Активный', value: 'active', description: 'Регулярные тренировки' },
  { label: 'Спортсмен', value: 'athlete', description: 'Высокие показатели' },
  { label: 'Восстановление', value: 'recovery', description: 'Улучшающиеся метрики' },
];

export const SettingsScreen: React.FC = () => {
  const isDark = useStore(state => state.isDarkMode);
  const setIsDarkMode = useStore(state => state.setIsDarkMode);
  const simulationConfig = useStore(state => state.simulationConfig);
  const setSimulationProfile = useStore(state => state.setSimulationProfile);
  const setSimulationEnabled = useStore(state => state.setSimulationEnabled);
  const setDataSource = useStore(state => state.setDataSource);
  const [simulationService] = useState(() => new SimulationService(simulationConfig.profile));

  const theme = isDark ? colors.dark : colors.light;

  useEffect(() => {
    useStore.getState().loadSettings();
    simulationService.setProfile(simulationConfig.profile);
    simulationService.setDataSource(simulationConfig.dataSource);
    
    if (simulationConfig.enabled) {
      simulationService.startAutoSimulation(60);
    }
  }, []);

  const handleGenerateInitialData = async () => {
    try {
      await initDatabase();
      simulationService.setDataSource(simulationConfig.dataSource);
      await simulationService.generateInitialData(7);
      alert('Данные успешно сгенерированы!');
    } catch (error) {
      console.error('Error generating initial data:', error);
      alert('Ошибка при генерации данных');
    }
  };

  const handleDataSourceChange = (source: DataSource) => {
    setDataSource(source);
    simulationService.setDataSource(source);
    
    if (simulationConfig.enabled) {
      simulationService.stopAutoSimulation();
      simulationService.startAutoSimulation(60);
    }
  };

  const handleProfileChange = (profile: UserProfile) => {
    setSimulationProfile(profile);
    simulationService.setProfile(profile);
    
    if (simulationConfig.enabled) {
      simulationService.stopAutoSimulation();
      simulationService.startAutoSimulation(60);
    }
  };

  const handleSimulationToggle = (enabled: boolean) => {
    setSimulationEnabled(enabled);
    if (enabled) {
      simulationService.startAutoSimulation(60);
    } else {
      simulationService.stopAutoSimulation();
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Настройки</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Внешний вид
        </Text>
        <View style={[styles.settingItem, { backgroundColor: theme.surface }]}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Темная тема
            </Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              Переключить темный режим
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={setIsDarkMode}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Интеграция с устройствами
        </Text>

        <View style={styles.profileSection}>
          <Text style={[styles.settingLabel, { color: theme.text, marginBottom: 12 }]}>
            Источник данных
          </Text>
          
          <TouchableOpacity
            onPress={() => handleDataSourceChange('simulation')}
            style={[
              styles.profileButton,
              {
                backgroundColor:
                  simulationConfig.dataSource === 'simulation'
                    ? theme.primary
                    : theme.surface,
              },
            ]}
          >
            <View style={styles.profileContent}>
              <Text
                style={[
                  styles.profileLabel,
                  {
                    color:
                      simulationConfig.dataSource === 'simulation'
                        ? '#FFFFFF'
                        : theme.text,
                  },
                ]}
              >
                📱 Симуляция
              </Text>
              <Text
                style={[
                  styles.profileDescription,
                  {
                    color:
                      simulationConfig.dataSource === 'simulation'
                        ? 'rgba(255,255,255,0.8)'
                        : theme.textSecondary,
                  },
                ]}
              >
                Использовать симулированные данные
              </Text>
            </View>
            {simulationConfig.dataSource === 'simulation' && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDataSourceChange('imsit_watch')}
            style={[
              styles.profileButton,
              {
                backgroundColor:
                  simulationConfig.dataSource === 'imsit_watch'
                    ? theme.primary
                    : theme.surface,
              },
            ]}
          >
            <View style={styles.profileContent}>
              <Text
                style={[
                  styles.profileLabel,
                  {
                    color:
                      simulationConfig.dataSource === 'imsit_watch'
                        ? '#FFFFFF'
                        : theme.text,
                  },
                ]}
              >
                ⌚ IMSIT Watch
              </Text>
              <Text
                style={[
                  styles.profileDescription,
                  {
                    color:
                      simulationConfig.dataSource === 'imsit_watch'
                        ? 'rgba(255,255,255,0.8)'
                        : theme.textSecondary,
                  },
                ]}
              >
                Интеграция с умными часами IMSIT
              </Text>
            </View>
            {simulationConfig.dataSource === 'imsit_watch' && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDataSourceChange('device')}
            style={[
              styles.profileButton,
              {
                backgroundColor:
                  simulationConfig.dataSource === 'device'
                    ? theme.primary
                    : theme.surface,
              },
            ]}
          >
            <View style={styles.profileContent}>
              <Text
                style={[
                  styles.profileLabel,
                  {
                    color:
                      simulationConfig.dataSource === 'device'
                        ? '#FFFFFF'
                        : theme.text,
                  },
                ]}
              >
                📱 Устройство
              </Text>
              <Text
                style={[
                  styles.profileDescription,
                  {
                    color:
                      simulationConfig.dataSource === 'device'
                        ? 'rgba(255,255,255,0.8)'
                        : theme.textSecondary,
                  },
                ]}
              >
                Использовать данные с устройства (HealthKit/Google Fit)
              </Text>
            </View>
            {simulationConfig.dataSource === 'device' && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Симуляция данных
        </Text>

        <View style={[styles.settingItem, { backgroundColor: theme.surface }]}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Включить симуляцию
            </Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              Автоматическая генерация данных
            </Text>
          </View>
          <Switch
            value={simulationConfig.enabled}
            onValueChange={handleSimulationToggle}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={simulationConfig.enabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <View style={styles.profileSection}>
          <Text style={[styles.settingLabel, { color: theme.text, marginBottom: 12 }]}>
            Профиль пользователя
          </Text>
          {profiles.map(profile => (
            <TouchableOpacity
              key={profile.value}
              onPress={() => handleProfileChange(profile.value)}
              style={[
                styles.profileButton,
                {
                  backgroundColor:
                    simulationConfig.profile === profile.value
                      ? theme.primary
                      : theme.surface,
                },
              ]}
            >
              <View style={styles.profileContent}>
                <Text
                  style={[
                    styles.profileLabel,
                    {
                      color:
                        simulationConfig.profile === profile.value
                          ? '#FFFFFF'
                          : theme.text,
                    },
                  ]}
                >
                  {profile.label}
                </Text>
                <Text
                  style={[
                    styles.profileDescription,
                    {
                      color:
                        simulationConfig.profile === profile.value
                          ? 'rgba(255,255,255,0.8)'
                          : theme.textSecondary,
                    },
                  ]}
                >
                  {profile.description}
                </Text>
              </View>
              {simulationConfig.profile === profile.value && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleGenerateInitialData}
          style={[styles.actionButton, { backgroundColor: theme.secondary }]}
        >
          <Text style={styles.actionButtonText}>
            Сгенерировать начальные данные (7 дней)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          О приложении
        </Text>
        <View style={[styles.aboutItem, { backgroundColor: theme.surface }]}>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            Версия 1.0.0
          </Text>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            Health Tracker - полностью локальное приложение для учета здоровья
          </Text>
        </View>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  profileSection: {
    marginTop: 8,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  profileContent: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  profileDescription: {
    fontSize: 14,
  },
  checkmark: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aboutItem: {
    padding: 16,
    borderRadius: 12,
  },
  aboutText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

