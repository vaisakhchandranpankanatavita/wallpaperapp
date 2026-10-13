/**
 * Web build: there is no photo library, so open the full-res image in a new
 * tab where the browser's own "Save image" works.
 */
import { Linking } from 'react-native';

import type { Wallpaper } from '@/src/data/wallpapers';
import type { SaveResult } from './saveWallpaper';

export async function saveWallpaper(wallpaper: Wallpaper): Promise<SaveResult> {
  await Linking.openURL(wallpaper.full);
  return 'opened-in-browser';
}
