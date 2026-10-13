/**
 * Downloads a wallpaper to the device's photo library.
 *
 * 1. Ask for write-only media permission.
 * 2. Download the full-res file into the cache directory (expo-file-system).
 * 3. Register it as a library asset (expo-media-library `Asset.create`).
 *
 * Note: neither iOS nor Expo expose an API to *set* the system wallpaper,
 * so "Set as wallpaper" saves the image and tells the user where to apply it.
 */
import { Directory, File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import type { Wallpaper } from '@/src/data/wallpapers';

export type SaveResult = 'saved' | 'denied' | 'opened-in-browser';

// Web has its own implementation in saveWallpaper.web.ts.
export async function saveWallpaper(wallpaper: Wallpaper): Promise<SaveResult> {
  const permission = await MediaLibrary.requestPermissionsAsync(true, ['photo']);
  if (!permission.granted) return 'denied';

  const dir = new Directory(Paths.cache, 'wallpapers');
  if (!dir.exists) dir.create({ idempotent: true });

  const target = new File(dir, `${wallpaper.id}.jpg`);
  const file = target.exists
    ? target
    : await File.downloadFileAsync(wallpaper.full, target, { idempotent: true });

  await MediaLibrary.Asset.create(file.uri);
  return 'saved';
}
