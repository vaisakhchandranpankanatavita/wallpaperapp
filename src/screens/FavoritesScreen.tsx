/**
 * Favourites tab: the same masonry grid, filtered to hearted wallpapers.
 */
import React, { useMemo } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { EmptyState } from '@/src/components/EmptyState';
import { MasonryGrid } from '@/src/components/MasonryGrid';
import { WALLPAPERS } from '@/src/data/wallpapers';
import type { TabScreenProps } from '@/src/navigation/types';
import { useFavorites } from '@/src/state/FavoritesContext';

const H_PADDING = 20;

export function FavoritesScreen({ navigation }: TabScreenProps<'Favorites'>) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { favoriteIds } = useFavorites();

  const favorites = useMemo(
    () => WALLPAPERS.filter((w) => favoriteIds.has(w.id)),
    [favoriteIds],
  );

  return (
    <Box className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: H_PADDING,
          paddingBottom: insets.bottom + 120,
        }}
      >
        <Heading size="2xl" className="mb-1 font-inter-extrabold text-ink">
          Favourites
        </Heading>
        <Text className="mb-6 text-muted-foreground">
          {favorites.length} saved wallpaper{favorites.length === 1 ? '' : 's'}
        </Text>

        {favorites.length ? (
          <MasonryGrid
            data={favorites}
            width={width - H_PADDING * 2}
            onPressItem={(w) => navigation.navigate('WallpaperDetail', { id: w.id })}
          />
        ) : (
          <EmptyState
            title="No favourites yet"
            message="Tap the heart on any wallpaper to keep it here."
          />
        )}
      </ScrollView>
    </Box>
  );
}
