/**
 * Data access for wallpapers, wrapped in React Query.
 *
 * The "server" here is the mock catalogue with a small artificial delay so
 * loading states are visible. Replace `fetchWallpapers` with a real HTTP call
 * and the screens keep working unchanged.
 */
import { useQuery } from '@tanstack/react-query';

import { CATEGORIES, CategoryId, WALLPAPERS, Wallpaper } from '@/src/data/wallpapers';

export type WallpaperQuery = {
  category: CategoryId;
  search: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Applies the category "feed" ordering and the free-text search. */
async function fetchWallpapers({ category, search }: WallpaperQuery): Promise<Wallpaper[]> {
  await delay(350);

  let list = [...WALLPAPERS];

  switch (category) {
    case 'recents':
      break; // catalogue order == newest first
    case 'trending':
      // Trending = best download/view conversion.
      list.sort((a, b) => b.downloads / b.views - a.downloads / a.views);
      break;
    case 'popular':
      list.sort((a, b) => b.views - a.views);
      break;
    default:
      list = list.filter((w) => w.category === category);
  }

  const q = search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.category.includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  return list;
}

export function useWallpapers(query: WallpaperQuery) {
  return useQuery({
    queryKey: ['wallpapers', query.category, query.search.trim().toLowerCase()],
    queryFn: () => fetchWallpapers(query),
    // Keep showing the previous grid while the next category loads (no flash).
    placeholderData: (previous) => previous,
  });
}

/** Synchronous lookup – the detail screen receives only an id via navigation. */
export function getWallpaperById(id: string): Wallpaper | undefined {
  return WALLPAPERS.find((w) => w.id === id);
}

export function getCategoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
