/**
 * Heart toggle used on cards and on the detail screen. When toggled on it
 * fills red and does a little "beat" (scale 1 → 1.25 → 1) via Moti.
 */
import React from 'react';
import { MotiView } from 'moti';
import { Heart } from 'lucide-react-native';

import { useFavorites } from '@/src/state/FavoritesContext';
import { colors } from '@/src/theme/tokens';
import { ScalePressable } from './ScalePressable';

type Props = {
  wallpaperId: string;
  size?: number;
  /** `glass` = translucent white disc (cards), `solid` = dark disc (detail header). */
  variant?: 'glass' | 'dark';
};

export function FavoriteButton({ wallpaperId, size = 34, variant = 'glass' }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(wallpaperId);

  const idleBg = variant === 'glass' ? 'rgba(255,255,255,0.28)' : 'rgba(18,18,18,0.35)';

  return (
    <ScalePressable
      onPress={() => toggleFavorite(wallpaperId)}
      pressedScale={0.85}
      animateOnMount={false}
      hitSlop={8}
      accessibilityLabel={active ? 'Remove from favourites' : 'Add to favourites'}
      accessibilityState={{ selected: active }}
    >
      <MotiView
        // Re-keying on state change replays the heart-beat each toggle.
        key={active ? 'on' : 'off'}
        from={{ scale: active ? 0.6 : 1 }}
        animate={{ scale: 1, backgroundColor: active ? colors.heart : idleBg }}
        transition={{ type: 'spring', damping: 9, stiffness: 300 }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: active ? 0 : 1.5,
          borderColor: 'rgba(255,255,255,0.85)',
        }}
      >
        <Heart
          size={size * 0.47}
          color={colors.white}
          fill={active ? colors.white : 'transparent'}
          strokeWidth={2.4}
        />
      </MotiView>
    </ScalePressable>
  );
}
