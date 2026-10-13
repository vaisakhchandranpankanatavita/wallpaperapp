/**
 * Root native stack.
 *
 *   Welcome ──▶ Main (tabs) ──▶ WallpaperDetail
 *
 * The detail screen is presented as a full-screen modal that slides up from
 * the bottom, matching the "tap a card, the photo rises into view" flow.
 */
import React from 'react';
import { DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WallpaperDetailScreen } from '@/src/screens/WallpaperDetailScreen';
import { WelcomeScreen } from '@/src/screens/WelcomeScreen';
import { colors } from '@/src/theme/tokens';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Strictly light theme for navigation chrome.
const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.ink,
    primary: colors.ink,
    border: colors.border,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />
        <Stack.Screen
          name="WallpaperDetail"
          component={WallpaperDetailScreen}
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
            gestureEnabled: true,
            gestureDirection: 'vertical',
            fullScreenGestureEnabled: true,
            statusBarStyle: 'light',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
