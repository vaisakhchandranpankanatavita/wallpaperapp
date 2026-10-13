/**
 * Frosted-glass container (glassmorphism) used for the detail-screen panels
 * and the floating tab bar.
 *
 * iOS gets a real UIVisualEffectView blur. Android's native blur needs a
 * dedicated BlurTargetView, so there we fall back to a translucent tint,
 * which is visually close on top of photos and costs nothing.
 */
import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: 'light' | 'dark';
  /** Extra colour wash over the blur – tunes legibility. */
  overlay?: string;
};

export function GlassView({ children, style, intensity = 40, tint = 'dark', overlay }: Props) {
  const wash =
    overlay ?? (tint === 'dark' ? 'rgba(20,20,20,0.28)' : 'rgba(255,255,255,0.55)');
  const androidWash = tint === 'dark' ? 'rgba(28,28,28,0.62)' : 'rgba(255,255,255,0.86)';

  return (
    <View style={[styles.clip, style]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={intensity} tint={tint} style={[StyleSheet.absoluteFill, styles.behind]} />
      ) : null}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          styles.behind,
          { backgroundColor: Platform.OS === 'ios' ? wash : androidWash },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  // Keep the blur/wash layers under the content. Needed on web, where
  // absolutely-positioned layers otherwise paint above static children.
  behind: { zIndex: -1 },
  clip: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
  },
});
