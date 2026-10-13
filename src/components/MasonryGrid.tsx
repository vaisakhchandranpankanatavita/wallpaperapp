/**
 * Two-column masonry layout.
 *
 * Items are greedily placed into whichever column is currently shorter, which
 * keeps the columns balanced even with mixed aspect ratios. The right column
 * is nudged down a little at the top for the staggered "Pinterest" look.
 */
import React, { useMemo } from 'react';

import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import type { Wallpaper } from '@/src/data/wallpapers';
import { WallpaperCard } from './WallpaperCard';

type Props = {
  data: Wallpaper[];
  /** Total width available to the grid (screen width minus horizontal padding). */
  width: number;
  gap?: number;
  onPressItem: (wallpaper: Wallpaper) => void;
};

const RIGHT_COLUMN_OFFSET = 28;

export function MasonryGrid({ data, width, gap = 14, onPressItem }: Props) {
  const columnWidth = (width - gap) / 2;

  const columns = useMemo(() => {
    const left: { item: Wallpaper; index: number }[] = [];
    const right: { item: Wallpaper; index: number }[] = [];
    let leftHeight = 0;
    let rightHeight = RIGHT_COLUMN_OFFSET;

    data.forEach((item, index) => {
      const h = columnWidth / item.aspectRatio;
      if (leftHeight <= rightHeight) {
        left.push({ item, index });
        leftHeight += h + gap;
      } else {
        right.push({ item, index });
        rightHeight += h + gap;
      }
    });
    return [left, right];
  }, [data, columnWidth, gap]);

  return (
    <HStack style={{ gap }} className="items-start">
      {columns.map((column, columnIndex) => (
        <VStack
          key={columnIndex}
          style={{ width: columnWidth, paddingTop: columnIndex === 1 ? RIGHT_COLUMN_OFFSET : 0 }}
        >
          {column.map(({ item, index }) => (
            <WallpaperCard
              key={item.id}
              wallpaper={item}
              width={columnWidth}
              index={index}
              onPress={onPressItem}
            />
          ))}
        </VStack>
      ))}
    </HStack>
  );
}
