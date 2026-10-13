/**
 * Custom bottom tab bar: a floating frosted pill (as in the reference design)
 * with a white "thumb" that springs to the active tab.
 */
import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, House, LayoutGrid, LucideIcon } from 'lucide-react-native';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { colors, radii, shadows } from '@/src/theme/tokens';
import { GlassView } from './GlassView';

const ICONS: Record<string, LucideIcon> = {
  Home: House,
  Categories: LayoutGrid,
  Favorites: Heart,
};

const BAR_HEIGHT = 64;
const INSET = 6;
const BAR_WIDTH_RATIO = 0.78;

export function FloatingTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // Bar width is derived (not measured) so the thumb can render on first frame.
  const barWidth = Math.min(width * BAR_WIDTH_RATIO, 420);
  const tabWidth = (barWidth - INSET * 2) / state.routes.length;

  return (
    <Box
      className="absolute self-center"
      style={{ bottom: Math.max(insets.bottom, 16), width: barWidth }}
    >
      <MotiView
        from={{ translateY: 40, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 18, delay: 250 }}
        style={[{ borderRadius: radii.pill }, shadows.float]}
      >
        <GlassView
          tint="dark"
          intensity={50}
          overlay="rgba(70,62,58,0.45)"
          style={{ height: BAR_HEIGHT, borderRadius: radii.pill }}
        >
          <HStack className="flex-1 items-center px-1.5">
            {/* Sliding white thumb behind the active icon */}
            <MotiView
              animate={{ translateX: state.index * tabWidth }}
              transition={{ type: 'spring', damping: 18, stiffness: 180 }}
              style={[
                styles.thumb,
                { width: tabWidth, height: BAR_HEIGHT - INSET * 2, left: INSET },
              ]}
            />

            {state.routes.map((route, index) => {
              const focused = state.index === index;
              const Icon = ICONS[route.name] ?? House;
              const { options } = descriptors[route.key];

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              };

              return (
                <Pressable
                  key={route.key}
                  onPress={onPress}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: focused }}
                  accessibilityLabel={options.title ?? route.name}
                  className="h-full flex-1 items-center justify-center"
                >
                  <MotiView
                    animate={{ scale: focused ? 1.08 : 1 }}
                    transition={{ type: 'spring', damping: 14 }}
                  >
                    <Icon
                      size={22}
                      color={focused ? colors.ink : colors.white}
                      fill={focused ? colors.ink : colors.white}
                      strokeWidth={2}
                    />
                  </MotiView>
                </Pressable>
              );
            })}
          </HStack>
        </GlassView>
      </MotiView>
    </Box>
  );
}

const styles = StyleSheet.create({
  thumb: {
    position: 'absolute',
    top: INSET,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
  },
});
