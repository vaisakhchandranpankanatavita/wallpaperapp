/**
 * Bottom tabs (Home / Categories / Favorites) rendered with the custom
 * floating glass tab bar instead of the default bar.
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FloatingTabBar } from '@/src/components/FloatingTabBar';
import { CategoriesScreen } from '@/src/screens/CategoriesScreen';
import { FavoritesScreen } from '@/src/screens/FavoritesScreen';
import { HomeScreen } from '@/src/screens/HomeScreen';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Cross-fade between tabs for a softer feel than an instant swap.
        animation: 'fade',
        sceneStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}
