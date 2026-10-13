/**
 * Mock wallpaper catalogue.
 *
 * Every entry points at a public Unsplash photo. `aspectRatio` (width / height)
 * drives the masonry tile height so the grid gets a natural, staggered rhythm.
 * Swap this file for a real API later — the shape matches what
 * `src/api/wallpapers.ts` expects.
 */

export type CategoryId =
  | 'recents'
  | 'trending'
  | 'popular'
  | 'nature'
  | 'abstract'
  | 'minimal'
  | 'amoled'
  | 'animals'
  | 'city';

export type Category = {
  id: CategoryId;
  label: string;
  /** Cover image used on the Categories tab. */
  cover: string;
};

export type Wallpaper = {
  id: string;
  title: string;
  author: string;
  /** Primary category (shown as "Featured In" on the detail screen). */
  category: Exclude<CategoryId, 'recents' | 'trending' | 'popular'>;
  tags: string[];
  views: number;
  downloads: number;
  /** width / height of the tile in the grid. */
  aspectRatio: number;
  /** Dominant colour – used as the placeholder while the image loads. */
  color: string;
  /** Lightweight grid image. */
  thumb: string;
  /** Full-resolution (4K-ish) image for the detail screen & downloads. */
  full: string;
};

/** Build sized Unsplash CDN URLs from a photo id. */
const unsplash = (photoId: string) => ({
  thumb: `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=600&q=80`,
  full: `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=2160&q=90`,
});

/**
 * Raw JSON-like source. Kept as plain objects so it can be moved to a
 * `.json` file or served from a backend without changes.
 */
const RAW: Array<Omit<Wallpaper, 'thumb' | 'full'> & { photoId: string }> = [
  { id: 'w01', photoId: '1501785888041-af3ef285b470', title: 'Emerald Lake Island', author: 'Pietro De Grandi', category: 'nature', tags: ['Lake', 'Island', 'Forest', 'Summer'], views: 364039, downloads: 43003, aspectRatio: 0.72, color: '#4a6b7c' },
  { id: 'w02', photoId: '1506905925346-21bda4d32df4', title: 'Above the Clouds', author: 'Kalen Emsley', category: 'nature', tags: ['Mountain', 'Clouds', 'Peak'], views: 512870, downloads: 61220, aspectRatio: 0.82, color: '#8a9bb0' },
  { id: 'w03', photoId: '1618005182384-a83a8bd57fbe', title: 'Liquid Gradient', author: 'Pawel Czerwinski', category: 'abstract', tags: ['3D', 'Gradient', 'Fluid'], views: 220114, downloads: 30981, aspectRatio: 0.66, color: '#7b5ea7' },
  { id: 'w04', photoId: '1462331940025-496dfbfc7564', title: 'Deep Space Nebula', author: 'NASA', category: 'amoled', tags: ['Space', 'Nebula', 'Dark'], views: 801233, downloads: 120402, aspectRatio: 0.75, color: '#1b1033' },
  { id: 'w05', photoId: '1518791841217-8f162f1e1131', title: 'Curious Tabby Cat', author: 'Mikhail Vasilyev', category: 'animals', tags: ['Cat', 'Pet', 'Cute', 'Animal'], views: 433901, downloads: 52010, aspectRatio: 0.8, color: '#8c7a6b' },
  { id: 'w06', photoId: '1470071459604-3b5ec3a7fe05', title: 'Misty Valley Morning', author: 'Lukasz Szmigiel', category: 'nature', tags: ['Fog', 'Hills', 'Morning'], views: 298440, downloads: 38870, aspectRatio: 0.7, color: '#6f7f74' },
  { id: 'w07', photoId: '1477959858617-67f85cf4f1df', title: 'City of Lights', author: 'Pedro Lastra', category: 'city', tags: ['Skyline', 'Night', 'Urban'], views: 187322, downloads: 21450, aspectRatio: 0.78, color: '#23324a' },
  { id: 'w08', photoId: '1579546929518-9e396f3cc809', title: 'Candy Gradient', author: 'Gradienta', category: 'minimal', tags: ['Gradient', 'Pastel', 'Clean'], views: 154980, downloads: 27711, aspectRatio: 0.68, color: '#e0a3c4' },
  { id: 'w09', photoId: '1474511320723-9a56873867b5', title: 'Red Fox in the Wild', author: 'Ray Hennessy', category: 'animals', tags: ['Fox', 'Wildlife', 'Animal'], views: 266031, downloads: 33024, aspectRatio: 0.74, color: '#9a6a3d' },
  { id: 'w10', photoId: '1419242902214-272b3f66ee7a', title: 'Milky Way Night', author: 'Jeremy Thomas', category: 'amoled', tags: ['Stars', 'Galaxy', 'Night'], views: 690112, downloads: 98440, aspectRatio: 0.66, color: '#0c1022' },
  { id: 'w11', photoId: '1541701494587-cb58502866ab', title: 'Paint Explosion', author: 'Steve Johnson', category: 'abstract', tags: ['Paint', 'Colorful', 'Art'], views: 132455, downloads: 18003, aspectRatio: 0.8, color: '#d36b4a' },
  { id: 'w12', photoId: '1464822759023-fed622ff2c3b', title: 'Alpine Ridge', author: 'Kalen Emsley', category: 'nature', tags: ['Mountain', 'Snow', 'Alps'], views: 345120, downloads: 40118, aspectRatio: 0.72, color: '#5b6f86' },
  { id: 'w13', photoId: '1507525428034-b723cf961d3e', title: 'Quiet Shoreline', author: 'Sean Oulashin', category: 'minimal', tags: ['Beach', 'Ocean', 'Calm'], views: 410770, downloads: 50311, aspectRatio: 0.76, color: '#7fb3c7' },
  { id: 'w14', photoId: '1543466835-00a7907e9de1', title: 'Happy Pup', author: 'Alvan Nee', category: 'animals', tags: ['Dog', 'Pet', 'Puppy'], views: 377901, downloads: 46672, aspectRatio: 0.7, color: '#b49a7a' },
  { id: 'w15', photoId: '1519681393784-d120267933ba', title: 'Starlit Summit', author: 'Benjamin Voros', category: 'amoled', tags: ['Mountain', 'Stars', 'Night'], views: 588013, downloads: 77009, aspectRatio: 0.82, color: '#1d2740' },
  { id: 'w16', photoId: '1557672172-298e090bd0f1', title: 'Soft Aurora', author: 'Gradienta', category: 'abstract', tags: ['Gradient', 'Blur', 'Aurora'], views: 99021, downloads: 15530, aspectRatio: 0.66, color: '#5a63c9' },
  { id: 'w17', photoId: '1449824913935-59a10b8d2000', title: 'Downtown Streets', author: 'Pedro Lastra', category: 'city', tags: ['Street', 'Urban', 'Buildings'], views: 120340, downloads: 13880, aspectRatio: 0.74, color: '#6b7380' },
  { id: 'w18', photoId: '1441974231531-c6227db76b6e', title: 'Sunlit Forest', author: 'Sebastian Unrau', category: 'nature', tags: ['Forest', 'Trees', 'Sunlight'], views: 455812, downloads: 59020, aspectRatio: 0.7, color: '#4b6b3a' },
  { id: 'w19', photoId: '1426604966848-d7adac402bff', title: 'Yosemite Valley', author: 'Bailey Zindel', category: 'nature', tags: ['Valley', 'Cliffs', 'Park'], views: 501200, downloads: 64110, aspectRatio: 0.8, color: '#55708a' },
  { id: 'w20', photoId: '1480714378408-67cf0d13bc1b', title: 'Manhattan Dusk', author: 'Ben Dumond', category: 'city', tags: ['New York', 'Skyline', 'Dusk'], views: 240777, downloads: 29330, aspectRatio: 0.68, color: '#3d4660' },
];

export const WALLPAPERS: Wallpaper[] = RAW.map(({ photoId, ...rest }) => ({
  ...rest,
  ...unsplash(photoId),
}));

export const CATEGORIES: Category[] = [
  { id: 'recents', label: 'Recents', cover: WALLPAPERS[0].thumb },
  { id: 'trending', label: 'Trending', cover: WALLPAPERS[3].thumb },
  { id: 'popular', label: 'Popular', cover: WALLPAPERS[1].thumb },
  { id: 'nature', label: 'Nature', cover: WALLPAPERS[5].thumb },
  { id: 'abstract', label: 'Abstract', cover: WALLPAPERS[2].thumb },
  { id: 'minimal', label: 'Minimal', cover: WALLPAPERS[12].thumb },
  { id: 'amoled', label: 'AMOLED', cover: WALLPAPERS[9].thumb },
  { id: 'animals', label: 'Animals', cover: WALLPAPERS[4].thumb },
  { id: 'city', label: 'City', cover: WALLPAPERS[6].thumb },
];

/** Fallback when an Unsplash URL can't be reached – deterministic per id. */
export const fallbackImage = (id: string, width = 600) =>
  `https://picsum.photos/seed/${id}/${width}/${Math.round(width * 1.5)}`;
