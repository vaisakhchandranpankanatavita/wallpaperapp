/**
 * Rounded search field built from Gluestack's Input primitives.
 * The border animates to ink while focused.
 */
import React, { useState } from 'react';
import { MotiView } from 'moti';
import { Search, X } from 'lucide-react-native';

import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { colors, radii } from '@/src/theme/tokens';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = 'Search wallpapers' }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <MotiView
      animate={{ borderColor: focused ? colors.ink : colors.border }}
      transition={{ type: 'timing', duration: 180 }}
      style={{ borderWidth: 1.5, borderRadius: radii.pill, backgroundColor: colors.background }}
    >
      <Input className="h-12 rounded-full border-0 bg-transparent px-4 shadow-none">
        <InputSlot>
          <InputIcon as={Search} className="h-5 w-5 text-ink" />
        </InputSlot>
        <InputField
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          returnKeyType="search"
          autoCorrect={false}
          className="font-body text-[15px] text-ink"
        />
        {value.length > 0 ? (
          <InputSlot onPress={() => onChangeText('')} accessibilityLabel="Clear search">
            <InputIcon as={X} className="h-4 w-4 text-muted-foreground" />
          </InputSlot>
        ) : null}
      </Input>
    </MotiView>
  );
}
