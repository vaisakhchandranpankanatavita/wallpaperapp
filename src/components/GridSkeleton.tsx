/**
 * Pulsing placeholder tiles shown during the first load.
 */
import React from 'react';
import { MotiView } from 'moti';

import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { radii } from '@/src/theme/tokens';

const HEIGHTS = [[230, 190, 250], [200, 260, 180]];

export function GridSkeleton({ width, gap = 14 }: { width: number; gap?: number }) {
  const columnWidth = (width - gap) / 2;
  return (
    <HStack style={{ gap }}>
      {HEIGHTS.map((col, c) => (
        <VStack key={c} style={{ gap, width: columnWidth, paddingTop: c === 1 ? 28 : 0 }}>
          {col.map((h, i) => (
            <MotiView
              key={i}
              from={{ opacity: 0.45 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 800, loop: true, delay: (c * 3 + i) * 90 }}
              style={{ height: h, borderRadius: radii.card, backgroundColor: '#ECEEF1' }}
            />
          ))}
        </VStack>
      ))}
    </HStack>
  );
}
