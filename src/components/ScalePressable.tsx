/**
 * The app's base interactive primitive: a Gluestack <Pressable> wrapped in a
 * Moti view that
 *   1. pops in on mount   (from scale 0.9 / opacity 0 → 1), and
 *   2. squishes on press  (press-in → `pressedScale`, press-out → 1).
 *
 * Both animations run on the UI thread via Reanimated, so they stay at 60fps
 * even while the JS thread is busy rendering the grid.
 */
import React, { useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { Pressable } from '@/components/ui/pressable';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  /** Scale applied while the finger is down. */
  pressedScale?: number;
  /** Stagger the mount animation (ms). */
  delay?: number;
  /** Fire a light haptic tick on press. */
  haptic?: boolean;
  /** Skip the mount pop-in (e.g. for elements inside an already-animated parent). */
  animateOnMount?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  accessibilityLabel?: string;
  accessibilityState?: { selected?: boolean };
  hitSlop?: number;
};

export function ScalePressable({
  children,
  onPress,
  pressedScale = 0.95,
  delay = 0,
  haptic = true,
  animateOnMount = true,
  style,
  className,
  accessibilityLabel,
  accessibilityState,
  hitSlop,
}: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <MotiView
      from={animateOnMount ? { scale: 0.9, opacity: 0 } : undefined}
      animate={{ scale: pressed ? pressedScale : 1, opacity: 1 }}
      transition={{
        // Snappy spring for press feedback; the mount uses the same spring
        // but is offset by `delay` for staggered lists.
        type: 'spring',
        damping: 16,
        stiffness: 260,
        mass: 0.6,
        delay: pressed ? 0 : delay,
      }}
      style={style}
    >
      <Pressable
        className={className}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={() => {
          if (haptic) Haptics.selectionAsync().catch(() => {});
          onPress?.();
        }}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={accessibilityState}
        hitSlop={hitSlop}
      >
        {children}
      </Pressable>
    </MotiView>
  );
}
