/**
 * Top bar: menu icon, title, notification bell and avatar – mirrors the
 * reference design. A short greeting sits above the title.
 */
import React from 'react';
import { Bell, Menu } from 'lucide-react-native';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { colors, shadows } from '@/src/theme/tokens';
import { ScalePressable } from './ScalePressable';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomeHeader() {
  return (
    <HStack className="items-center justify-between">
      <HStack className="items-center gap-3">
        <ScalePressable accessibilityLabel="Open menu" hitSlop={10}>
          <Menu size={26} color={colors.ink} strokeWidth={2.4} />
        </ScalePressable>
        <VStack>
          <Text size="xs" className="font-inter-medium text-muted-foreground">
            {greeting()} 👋
          </Text>
          <Heading size="xl" className="font-inter-extrabold tracking-tight text-ink">
            4K Wallpaper
          </Heading>
        </VStack>
      </HStack>

      <HStack className="items-center gap-2">
        <ScalePressable accessibilityLabel="Notifications">
          <Box
            style={shadows.soft}
            className="h-11 w-11 items-center justify-center rounded-full border border-border bg-white"
          >
            <Bell size={20} color={colors.ink} fill={colors.ink} />
            {/* unread dot */}
            <Box className="absolute right-3 top-2.5 h-2 w-2 rounded-full bg-heart" />
          </Box>
        </ScalePressable>
        <ScalePressable accessibilityLabel="Profile">
          <Avatar className="h-11 w-11 overflow-hidden border-2 border-white" style={shadows.soft}>
            <AvatarImage
              source={{
                uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
              }}
              alt="Your profile"
            />
          </Avatar>
        </ScalePressable>
      </HStack>
    </HStack>
  );
}
