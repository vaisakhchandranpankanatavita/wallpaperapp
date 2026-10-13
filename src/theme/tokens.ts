/**
 * Design tokens for values that must be passed as JS (icon colours, shadows,
 * blur tints). Everything else is expressed as Tailwind classes backed by
 * the variables in `global.css`.
 */
import type { ViewStyle } from 'react-native';

export const colors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  ink: '#121212',
  muted: '#8A8F98',
  border: '#E9ECEF',
  heart: '#E5383B',
  white: '#FFFFFF',
} as const;

export const radii = {
  card: 24,
  pill: 999,
} as const;

/** Soft, diffused drop shadows (RN 0.76+ `boxShadow` works on iOS + Android). */
export const shadows = {
  soft: { boxShadow: '0px 8px 24px rgba(18, 18, 18, 0.08)' } satisfies ViewStyle,
  card: { boxShadow: '0px 14px 28px rgba(18, 18, 18, 0.16)' } satisfies ViewStyle,
  float: { boxShadow: '0px 18px 40px rgba(18, 18, 18, 0.22)' } satisfies ViewStyle,
} as const;
