/**
 * Category chip ("Recents", "Trending", …). The active pill is solid ink with
 * white text; inactive pills are soft grey surfaces. The colour swap is
 * animated with Moti so selection feels fluid rather than a hard toggle.
 */
import React from 'react';
import { MotiView } from 'moti';

import { Text } from '@/components/ui/text';
import { colors, radii } from '@/src/theme/tokens';
import { ScalePressable } from './ScalePressable';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  /** Index in the row – used to stagger the entrance. */
  index: number;
};

export function CategoryPill({ label, active, onPress, index }: Props) {
  return (
    <ScalePressable
      onPress={onPress}
      delay={index * 45}
      pressedScale={0.9}
      accessibilityLabel={`${label} category`}
      accessibilityState={{ selected: active }}
    >
      <MotiView
        animate={{ backgroundColor: active ? colors.ink : '#EEEFF1' }}
        transition={{ type: 'timing', duration: 220 }}
        style={{ borderRadius: radii.pill, paddingHorizontal: 18, paddingVertical: 10 }}
      >
        <Text
          size="sm"
          className={active ? 'font-inter-semibold text-white' : 'font-inter-medium text-[#3A3D42]'}
        >
          {label}
        </Text>
      </MotiView>
    </ScalePressable>
  );
}
