import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

interface LoadingSpinnerProps {
  isDark?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isDark = false }) => {
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

