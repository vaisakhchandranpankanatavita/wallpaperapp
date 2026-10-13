/**
 * Home / Discover screen.
 *
 *  ┌ sticky header (menu · title · bell · avatar) ┐  ← gains a shadow on scroll
 *  │ category pills (horizontal)                  │
 *  │ search                                       │
 *  │ 2-column masonry grid                        │
 *  └ floating tab bar overlays the bottom         ┘
 */
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, useWindowDimensions } from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useWallpapers } from '@/src/api/wallpapers';
import { CategoryPill } from '@/src/components/CategoryPill';
import { EmptyState } from '@/src/components/EmptyState';
import { GridSkeleton } from '@/src/components/GridSkeleton';
import { HomeHeader } from '@/src/components/HomeHeader';
import { MasonryGrid } from '@/src/components/MasonryGrid';
import { SearchBar } from '@/src/components/SearchBar';
import { CATEGORIES, CategoryId, Wallpaper } from '@/src/data/wallpapers';
import type { TabScreenProps } from '@/src/navigation/types';
import { colors } from '@/src/theme/tokens';
import { useDebouncedValue } from '@/src/utils/useDebouncedValue';

// Matches the `px-5` (20px) gutters used below.
const H_PADDING = 20;

export function HomeScreen({ navigation, route }: TabScreenProps<'Home'>) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [category, setCategory] = useState<CategoryId>('recents');
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 250);

  // Categories tab can deep-link into a category: navigate('Home', { category }).
  useEffect(() => {
    if (route.params?.category) setCategory(route.params.category);
  }, [route.params?.category]);

  const { data, isLoading, isFetching, refetch } = useWallpapers({
    category,
    search: debouncedSearch,
  });

  const openWallpaper = useCallback(
    (w: Wallpaper) => navigation.navigate('WallpaperDetail', { id: w.id }),
    [navigation],
  );

  return (
    <Box className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* ── Sticky header ─────────────────────────────────────────── */}
      <MotiView
        // Shadow fades in once content scrolls beneath the header.
        animate={{ shadowOpacity: scrolled ? 0.08 : 0 }}
        transition={{ type: 'timing', duration: 200 }}
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          paddingHorizontal: H_PADDING,
          backgroundColor: colors.background,
          zIndex: 10,
          shadowColor: colors.ink,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 12,
          elevation: scrolled ? 4 : 0,
        }}
      >
        <HomeHeader />
      </MotiView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        onScroll={(e) => setScrolled(e.nativeEvent.contentOffset.y > 4)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        // Leave room for the floating tab bar.
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={colors.ink} />
        }
      >
        {/* ── Category pills ──────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: H_PADDING, paddingVertical: 8, gap: 10 }}
        >
          {CATEGORIES.map((c, i) => (
            <CategoryPill
              key={c.id}
              index={i}
              label={c.label}
              active={c.id === category}
              onPress={() => setCategory(c.id)}
            />
          ))}
        </ScrollView>

        {/* ── Search ──────────────────────────────────────────────── */}
        <Box className="mb-5 mt-3 px-5">
          <SearchBar value={search} onChangeText={setSearch} />
        </Box>

        {/* ── Grid ────────────────────────────────────────────────── */}
        <Box className="px-5">
          {debouncedSearch.trim() && data ? (
            <HStack className="mb-3">
              <Text size="sm" className="font-inter-medium text-muted-foreground">
                {data.length} result{data.length === 1 ? '' : 's'} for “{debouncedSearch.trim()}”
              </Text>
            </HStack>
          ) : null}

          {isLoading ? (
            <GridSkeleton width={width - H_PADDING * 2} />
          ) : data && data.length > 0 ? (
            // Re-key on filter change so the staggered entrance replays.
            <MasonryGrid
              key={`${category}-${debouncedSearch}`}
              data={data}
              width={width - H_PADDING * 2}
              onPressItem={openWallpaper}
            />
          ) : (
            <EmptyState
              title="No wallpapers found"
              message="Try another keyword or pick a different category."
            />
          )}
        </Box>
      </ScrollView>
    </Box>
  );
}
