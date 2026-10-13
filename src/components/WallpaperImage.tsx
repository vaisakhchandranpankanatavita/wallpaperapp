/**
 * Gluestack Image backed by `expo-image`.
 *
 * Gluestack's `createImage` creator is renderer-agnostic, so instead of the
 * default RN <Image> we give it expo-image as the Root. That keeps the
 * Gluestack API (alt → aria-label, className styling) while gaining disk
 * caching, cross-fade transitions and placeholders – important for 4K assets.
 */
import React, { useState } from 'react';
import { Image as ExpoImage } from 'expo-image';
import { createImage } from '@gluestack-ui/core/image/creator';
import { styled } from 'nativewind';

import { fallbackImage } from '@/src/data/wallpapers';

// Teach NativeWind to map `className` onto expo-image's `style` prop.
const StyledExpoImage = styled(ExpoImage, { className: 'style' });
const UIImage = createImage({ Root: StyledExpoImage });

type Props = {
  id: string;
  uri: string;
  alt: string;
  /** Solid colour shown while the image streams in. */
  placeholderColor?: string;
  className?: string;
  /** Fallback width when the Unsplash URL fails. */
  fallbackWidth?: number;
  transition?: number;
  priority?: 'low' | 'normal' | 'high';
  /** Low-res image (e.g. the grid thumb, already cached) shown until `uri` loads. */
  placeholderUri?: string;
};

export function WallpaperImage({
  id,
  uri,
  alt,
  placeholderColor,
  className,
  fallbackWidth = 600,
  transition = 250,
  priority = 'normal',
  placeholderUri,
}: Props) {
  // If the CDN URL fails we swap to a deterministic picsum image so the grid
  // never shows empty holes.
  const [failed, setFailed] = useState(false);

  return (
    <UIImage
      source={{ uri: failed ? fallbackImage(id, fallbackWidth) : uri }}
      alt={alt}
      className={className}
      style={placeholderColor ? { backgroundColor: placeholderColor } : undefined}
      contentFit="cover"
      transition={transition}
      cachePolicy="memory-disk"
      priority={priority}
      recyclingKey={id}
      placeholder={placeholderUri ? { uri: placeholderUri } : undefined}
      placeholderContentFit="cover"
      onError={() => setFailed(true)}
    />
  );
}
