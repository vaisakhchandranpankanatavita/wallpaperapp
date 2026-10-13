/**
 * Grid tile: rounded image card with a soft shadow and a heart badge.
 *
 * Mount animation: fades in while sliding up 24px (staggered by `index`).
 * Press animation: handled by ScalePressable (squish to 0.96).
 */
import React from 'react';
import { MotiView } from 'moti';

import { Box } from '@/components/ui/box';
import type { Wallpaper } from '@/src/data/wallpapers';
import { radii, shadows } from '@/src/theme/tokens';
import { FavoriteButton } from './FavoriteButton';
import { ScalePressable } from './ScalePressable';
import { WallpaperImage } from './WallpaperImage';

type Props = {
  wallpaper: Wallpaper;
  width: number;
  index: number;
  onPress: (wallpaper: Wallpaper) => void;
};

export function WallpaperCard({ wallpaper, width, index, onPress }: Props) {
  const height = Math.round(width / wallpaper.aspectRatio);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 24 }}
      animate={{ opacity: 1, translateY: 0 }}
      // Cap the stagger so long lists don't wait seconds for the last tile.
      transition={{ type: 'timing', duration: 420, delay: Math.min(index, 10) * 60 }}
      style={{ marginBottom: 14 }}
    >
      <ScalePressable
        onPress={() => onPress(wallpaper)}
        pressedScale={0.96}
        animateOnMount={false}
        accessibilityLabel={`Open ${wallpaper.title}`}
        style={[{ borderRadius: radii.card }, shadows.card]}
      >
        <Box style={{ width, height, borderRadius: radii.card }} className="overflow-hidden bg-secondary">
          <WallpaperImage
            id={wallpaper.id}
            uri={wallpaper.thumb}
            alt={wallpaper.title}
            placeholderColor={wallpaper.color}
            className="h-full w-full"
          />

          {/* Heart badge – bottom-right like the reference design */}
          <Box className="absolute bottom-3 right-3">
            <FavoriteButton wallpaperId={wallpaper.id} />
          </Box>
        </Box>
      </ScalePressable>
    </MotiView>
  );
}
