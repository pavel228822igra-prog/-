import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStore } from './src/store/useStore';
import { initDatabase } from './src/database/database';

// Screens
import { DashboardScreen } from './src/screens/DashboardScreen';
import { HealthMetricsScreen } from './src/screens/HealthMetricsScreen';
import { ActivityLogScreen } from './src/screens/ActivityLogScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { RecommendationsScreen } from './src/screens/RecommendationsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const isDark = useStore(state => state.isDarkMode);
  const loadSettings = useStore(state => state.loadSettings);

  useEffect(() => {
    // Инициализация базы данных и загрузка настроек
    const initialize = async () => {
      try {
        await initDatabase();
        await loadSettings();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: isDark ? '#818CF8' : '#6366F1',
            tabBarInactiveTintColor: '#6B7280',
            tabBarStyle: {
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              borderTopColor: isDark ? '#374151' : '#E5E7EB',
            },
          }}
        >
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              tabBarLabel: 'Главная',
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size, color }}>🏠</Text>
              ),
            }}
          />
          <Tab.Screen
            name="HealthMetrics"
            component={HealthMetricsScreen}
            options={{
              tabBarLabel: 'Метрики',
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size, color }}>📊</Text>
              ),
            }}
          />
          <Tab.Screen
            name="ActivityLog"
            component={ActivityLogScreen}
            options={{
              tabBarLabel: 'Журнал',
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size, color }}>📝</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Analytics"
            component={AnalyticsScreen}
            options={{
              tabBarLabel: 'Аналитика',
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size, color }}>📈</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Recommendations"
            component={RecommendationsScreen}
            options={{
              tabBarLabel: 'Советы',
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size, color }}>💡</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Настройки',
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size, color }}>⚙️</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

