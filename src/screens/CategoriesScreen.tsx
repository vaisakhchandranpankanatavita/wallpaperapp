/**
 * Categories tab: large image tiles; tapping one opens Home filtered to it.
 */
import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ScalePressable } from '@/src/components/ScalePressable';
import { WallpaperImage } from '@/src/components/WallpaperImage';
import { CATEGORIES, WALLPAPERS } from '@/src/data/wallpapers';
import type { TabScreenProps } from '@/src/navigation/types';
import { radii, shadows } from '@/src/theme/tokens';

const H_PADDING = 20;
const GAP = 14;

export function CategoriesScreen({ navigation }: TabScreenProps<'Categories'>) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tileW = (width - H_PADDING * 2 - GAP) / 2;

  const countFor = (id: string) =>
    ['recents', 'trending', 'popular'].includes(id)
      ? WALLPAPERS.length
      : WALLPAPERS.filter((w) => w.category === id).length;

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
          Categories
        </Heading>
        <Text className="mb-6 text-muted-foreground">Find your next favourite vibe.</Text>

        <Box className="flex-row flex-wrap" style={{ gap: GAP }}>
          {CATEGORIES.map((c, i) => (
            <MotiView
              key={c.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: i * 55 }}
            >
              <ScalePressable
                animateOnMount={false}
                onPress={() => navigation.navigate('Home', { category: c.id })}
                accessibilityLabel={`Browse ${c.label}`}
                style={[{ borderRadius: radii.card }, shadows.card]}
              >
                <Box
                  className="overflow-hidden"
                  style={{ width: tileW, height: tileW * 1.1, borderRadius: radii.card }}
                >
                  <WallpaperImage id={`cat-${c.id}`} uri={c.cover} alt={c.label} className="h-full w-full" />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <Box className="absolute bottom-3 left-4">
                    <Text className="font-inter-bold text-[17px] text-white">{c.label}</Text>
                    <Text size="xs" className="text-white/80">
                      {countFor(c.id)} wallpapers
                    </Text>
                  </Box>
                </Box>
              </ScalePressable>
            </MotiView>
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}
