import React from 'react';
import { MotiView } from 'moti';
import { ImageOff } from 'lucide-react-native';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { colors } from '@/src/theme/tokens';

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      <VStack className="items-center gap-2 px-8 py-16">
        <ImageOff size={36} color={colors.muted} />
        <Heading size="md" className="font-inter-semibold text-ink">
          {title}
        </Heading>
        <Text size="sm" className="text-center text-muted-foreground">
          {message}
        </Text>
      </VStack>
    </MotiView>
  );
}
