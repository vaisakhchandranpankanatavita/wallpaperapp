/**
 * Full-screen wallpaper preview.
 *
 * Layers (bottom → top):
 *   1. Full-res image (grid thumb shown as placeholder → instant first paint)
 *   2. Top & bottom gradients for legibility
 *   3. Back button + favourite heart
 *   4. Glass info panel (title, stats, tags) + glass action bar
 *
 * Every overlay element stagger-fades in after the modal slides up. Tapping
 * the photo toggles an immersive "preview" mode that hides all chrome.
 */
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, ChevronRight, Download, ImageIcon } from 'lucide-react-native';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getCategoryLabel, getWallpaperById } from '@/src/api/wallpapers';
import { EmptyState } from '@/src/components/EmptyState';
import { FavoriteButton } from '@/src/components/FavoriteButton';
import { GlassView } from '@/src/components/GlassView';
import { ScalePressable } from '@/src/components/ScalePressable';
import { WallpaperImage } from '@/src/components/WallpaperImage';
import type { RootScreenProps } from '@/src/navigation/types';
import { colors, radii } from '@/src/theme/tokens';
import { formatCount } from '@/src/utils/format';
import { saveWallpaper } from '@/src/utils/saveWallpaper';

/** Shared stagger preset: fade + rise, offset by `step`. */
const enter = (step: number) =>
  ({
    from: { opacity: 0, translateY: 18 },
    animate: { opacity: 1, translateY: 0 },
    exit: { opacity: 0, translateY: 18 },
    transition: { type: 'timing', duration: 380, delay: 180 + step * 90 },
  }) as const;

export function WallpaperDetailScreen({ navigation, route }: RootScreenProps<'WallpaperDetail'>) {
  const insets = useSafeAreaInsets();
  const wallpaper = getWallpaperById(route.params.id);

  const [immersive, setImmersive] = useState(false);
  const [busy, setBusy] = useState<null | 'download' | 'apply'>(null);

  if (!wallpaper) {
    return (
      <Box className="flex-1 items-center justify-center bg-white">
        <EmptyState title="Wallpaper not found" message="It may have been removed." />
      </Box>
    );
  }

  const run = async (kind: 'download' | 'apply') => {
    if (busy) return;
    setBusy(kind);
    try {
      const result = await saveWallpaper(wallpaper);
      if (result === 'denied') {
        Alert.alert('Permission needed', 'Allow photo access to save wallpapers to your library.');
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      if (result === 'saved') {
        Alert.alert(
          kind === 'apply' ? 'Ready to apply' : 'Saved to Photos',
          kind === 'apply'
            ? Platform.OS === 'ios'
              ? 'Open Photos, select the image, tap Share ▸ Use as Wallpaper.'
              : 'Open your gallery, select the image and choose “Set as wallpaper”.'
            : `“${wallpaper.title}” is now in your photo library.`,
        );
      }
    } catch (e) {
      Alert.alert('Download failed', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <Box className="flex-1 bg-black">
      <StatusBar style="light" hidden={immersive} animated />

      {/* 1 ─ Photo. Scales down from 1.08 as the modal lands for a subtle "settle". */}
      <MotiView
        from={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ type: 'timing', duration: 700 }}
        style={StyleSheet.absoluteFill}
      >
        <Pressable
          className="h-full w-full"
          onPress={() => setImmersive((v) => !v)}
          accessibilityLabel={immersive ? 'Show controls' : 'Hide controls to preview'}
        >
          <WallpaperImage
            id={wallpaper.id}
            uri={wallpaper.full}
            placeholderUri={wallpaper.thumb}
            alt={wallpaper.title}
            placeholderColor={wallpaper.color}
            fallbackWidth={1440}
            priority="high"
            className="h-full w-full"
          />
        </Pressable>
      </MotiView>

      <AnimatePresence>
        {!immersive ? (
          <MotiView
            key="chrome"
            pointerEvents="box-none"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'timing', duration: 220 }}
            style={StyleSheet.absoluteFill}
          >
            {/* 2 ─ Legibility gradients */}
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(0,0,0,0.45)', 'transparent']}
              style={[styles.gradient, { top: 0, height: insets.top + 110 }]}
            />
            <LinearGradient
              pointerEvents="none"
              colors={['transparent', 'rgba(0,0,0,0.55)']}
              style={[styles.gradient, { bottom: 0, height: 380 }]}
            />

            {/* 3 ─ Top bar */}
            <MotiView {...enter(0)} style={[styles.topBar, { top: insets.top + 8 }]}>
              <ScalePressable
                onPress={() => navigation.goBack()}
                accessibilityLabel="Go back"
                animateOnMount={false}
              >
                <GlassView style={styles.circle}>
                  <ArrowLeft size={22} color={colors.white} strokeWidth={2.4} />
                </GlassView>
              </ScalePressable>
              <FavoriteButton wallpaperId={wallpaper.id} size={44} variant="dark" />
            </MotiView>

            {/* 4 ─ Bottom panels */}
            <VStack className="absolute left-0 right-0 gap-3 px-4" style={{ bottom: insets.bottom + 12 }}>
              <MotiView {...enter(1)}>
                <GlassView style={{ borderRadius: 28 }}>
                  <VStack className="gap-4 p-5">
                    <Heading size="xl" className="font-inter-semibold text-white">
                      {wallpaper.title}
                    </Heading>

                    {/* Stats */}
                    <MotiView {...enter(2)}>
                      <HStack className="gap-2">
                        <Stat value={formatCount(wallpaper.views)} label="Views" />
                        <Stat value={formatCount(wallpaper.downloads)} label="Downloads" />
                        <Stat value={getCategoryLabel(wallpaper.category)} label="Featured In" />
                      </HStack>
                    </MotiView>

                    {/* Tags */}
                    <MotiView {...enter(3)}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 8 }}
                      >
                        {wallpaper.tags.map((tag, i) => (
                          <ScalePressable key={tag} delay={500 + i * 60} pressedScale={0.9}>
                            <Box className="rounded-full bg-white/90 px-4 py-2">
                              <Text size="sm" className="font-inter-medium text-ink">
                                {tag}
                              </Text>
                            </Box>
                          </ScalePressable>
                        ))}
                      </ScrollView>
                    </MotiView>
                  </VStack>
                </GlassView>
              </MotiView>

              {/* Action bar: Download · ››› · Set as wallpaper */}
              <MotiView {...enter(4)}>
                <GlassView style={{ borderRadius: radii.pill }}>
                  <HStack className="items-center justify-between p-2">
                    <ScalePressable
                      onPress={() => run('download')}
                      animateOnMount={false}
                      accessibilityLabel="Download wallpaper"
                    >
                      <HStack className="h-14 w-28 items-center justify-center gap-2 rounded-full bg-white">
                        {busy === 'download' ? (
                          <ActivityIndicator color={colors.ink} />
                        ) : (
                          <>
                            <Download size={18} color={colors.ink} strokeWidth={2.4} />
                            <Text size="sm" className="font-inter-semibold text-ink">
                              Save
                            </Text>
                          </>
                        )}
                      </HStack>
                    </ScalePressable>

                    <ChevronTrail />

                    <ScalePressable
                      onPress={() => run('apply')}
                      animateOnMount={false}
                      accessibilityLabel="Set as wallpaper"
                    >
                      <HStack className="h-14 w-28 items-center justify-center gap-2 rounded-full bg-white/25">
                        {busy === 'apply' ? (
                          <ActivityIndicator color={colors.white} />
                        ) : (
                          <>
                            <Check size={18} color={colors.white} strokeWidth={3} />
                            <Text size="sm" className="font-inter-semibold text-white">
                              Apply
                            </Text>
                          </>
                        )}
                      </HStack>
                    </ScalePressable>
                  </HStack>
                </GlassView>
              </MotiView>
            </VStack>
          </MotiView>
        ) : (
          // Small hint so users know how to bring the controls back.
          <MotiView
            key="hint"
            pointerEvents="none"
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0 }}
            style={[styles.hint, { bottom: insets.bottom + 24 }]}
          >
            <GlassView style={{ borderRadius: radii.pill }}>
              <HStack className="items-center gap-2 px-4 py-2">
                <ImageIcon size={14} color={colors.white} />
                <Text size="xs" className="font-inter-medium text-white">
                  Tap anywhere to show controls
                </Text>
              </HStack>
            </GlassView>
          </MotiView>
        )}
      </AnimatePresence>
    </Box>
  );
}

/** Outlined stat bubble: big value, small caption. */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <VStack className="flex-1 items-center rounded-2xl border border-white/40 px-2 py-2">
      <Text numberOfLines={1} className="font-inter-semibold text-[15px] text-white">
        {value}
      </Text>
      <Text className="font-body text-[10px] text-white/70">{label}</Text>
    </VStack>
  );
}

/** The three looping chevrons ( › › › ) between the two action buttons. */
function ChevronTrail() {
  return (
    <HStack className="items-center">
      {[0, 1, 2].map((i) => (
        <MotiView
          key={i}
          from={{ opacity: 0.25 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 600, delay: i * 200, loop: true }}
          style={{ marginHorizontal: -3 }}
        >
          <ChevronRight size={20} color={colors.white} strokeWidth={3} />
        </MotiView>
      ))}
    </HStack>
  );
}

const styles = StyleSheet.create({
  gradient: { position: 'absolute', left: 0, right: 0 },
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: { position: 'absolute', alignSelf: 'center' },
});
