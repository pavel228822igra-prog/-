import { create } from 'zustand';
import { UserProfile, SimulationConfig, DataSource } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  isDarkMode: boolean;
  simulationConfig: SimulationConfig;
  setIsDarkMode: (isDark: boolean) => void;
  setSimulationProfile: (profile: UserProfile) => void;
  setSimulationIntensity: (intensity: number) => void;
  setDataSource: (source: DataSource) => void;
  setSimulationEnabled: (enabled: boolean) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}

const STORAGE_KEY = '@healthtracker_settings';

export const useStore = create<AppState>((set, get) => ({
  isDarkMode: false,
  simulationConfig: {
    profile: 'active',
    intensity: 50,
    enabled: true,
    dataSource: 'simulation',
  },

  setIsDarkMode: (isDark: boolean) => {
    set({ isDarkMode: isDark });
    get().saveSettings();
  },

  setSimulationProfile: (profile: UserProfile) => {
    set(state => ({
      simulationConfig: { ...state.simulationConfig, profile },
    }));
    get().saveSettings();
  },

  setSimulationIntensity: (intensity: number) => {
    set(state => ({
      simulationConfig: { ...state.simulationConfig, intensity },
    }));
    get().saveSettings();
  },

  setDataSource: (dataSource: DataSource) => {
    set(state => ({
      simulationConfig: { ...state.simulationConfig, dataSource },
    }));
    get().saveSettings();
  },

  setSimulationEnabled: (enabled: boolean) => {
    set(state => ({
      simulationConfig: { ...state.simulationConfig, enabled },
    }));
    get().saveSettings();
  },

  loadSettings: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const settings = JSON.parse(data);
        set({
          isDarkMode: settings.isDarkMode || false,
          simulationConfig: settings.simulationConfig || {
            profile: 'active',
            intensity: 50,
            enabled: true,
            dataSource: 'simulation',
          },
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  },

  saveSettings: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isDarkMode: state.isDarkMode,
          simulationConfig: state.simulationConfig,
        })
      );
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },
}));

