/**
 * Onboarding screen: a tilted, drifting collage of wallpapers that fades into
 * white, with the headline and a "Start Explore" CTA (first phone in the
 * reference design).
 */
import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ScalePressable } from '@/src/components/ScalePressable';
import { WallpaperImage } from '@/src/components/WallpaperImage';
import { WALLPAPERS } from '@/src/data/wallpapers';
import type { RootScreenProps } from '@/src/navigation/types';
import { shadows } from '@/src/theme/tokens';

const COLUMNS = 3;
const PER_COLUMN = 4;

export function WelcomeScreen({ navigation }: RootScreenProps<'Welcome'>) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const tileW = width * 0.36;
  const tileH = tileW * 1.18;

  // Pick 12 wallpapers that look good dark/vivid for the collage.
  const collage = WALLPAPERS.slice(0, COLUMNS * PER_COLUMN);

  return (
    <Box className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* ── Tilted collage ─────────────────────────────────────────── */}
      <Box className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: height * 0.68 }}>
        {/* Tilted container – a MotiView (not HStack) so the transform applies on web too */}
        <MotiView
          style={{
            flexDirection: 'row',
            gap: 14,
            transform: [{ rotate: '-12deg' }, { translateX: -width * 0.18 }, { translateY: -40 }],
          }}
        >
          {Array.from({ length: COLUMNS }).map((_, col) => (
            // Each column drifts vertically in opposite directions, forever.
            <MotiView
              key={col}
              from={{ translateY: col % 2 ? -30 : 0 }}
              animate={{ translateY: col % 2 ? 0 : -30 }}
              transition={{ type: 'timing', duration: 4000, loop: true }}
              style={{ gap: 14, marginTop: col * 36 }}
            >
              {collage.slice(col * PER_COLUMN, col * PER_COLUMN + PER_COLUMN).map((w, i) => (
                <MotiView
                  key={w.id}
                  from={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 15, delay: (col * PER_COLUMN + i) * 50 }}
                  style={[{ width: tileW, height: tileH, borderRadius: 22 }, shadows.card]}
                >
                  <WallpaperImage
                    id={w.id}
                    uri={w.thumb}
                    alt={w.title}
                    placeholderColor={w.color}
                    className="h-full w-full rounded-[22px]"
                  />
                </MotiView>
              ))}
            </MotiView>
          ))}
        </MotiView>

        {/* Fade the collage into the white page */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.85)', '#FFFFFF']}
          locations={[0.45, 0.82, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Box>

      {/* ── Copy + CTA ─────────────────────────────────────────────── */}
      <VStack
        className="absolute inset-x-0 bottom-0 items-center px-6"
        style={{ paddingBottom: insets.bottom + 28 }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 450 }}
        >
          <Heading className="text-center font-inter-extrabold text-[34px] leading-[40px] text-ink">
            Explore 4K{'\n'}Wallpapers
          </Heading>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 580 }}
        >
          <Text className="mt-3 text-center font-body text-[15px] leading-[22px] text-[#4A4E55]">
            Explore, Create, Share{'\n'}Ultra 4K Wallpapers Now!
          </Text>
        </MotiView>

        <ScalePressable
          delay={720}
          pressedScale={0.96}
          onPress={() => navigation.replace('Main', { screen: 'Home' })}
          accessibilityLabel="Start exploring"
          style={[{ width: '100%', marginTop: 28, borderRadius: 999 }, shadows.float]}
        >
          <Box className="h-16 w-full items-center justify-center rounded-full bg-ink">
            <Text className="font-inter-medium text-[18px] text-white">Start Explore</Text>
          </Box>
        </ScalePressable>
      </VStack>
    </Box>
  );
}

