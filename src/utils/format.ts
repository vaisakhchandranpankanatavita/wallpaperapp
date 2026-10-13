/**
 * Indian-style digit grouping to match the design (e.g. 364039 -> "3,64,039").
 * Implemented by hand so it doesn't depend on the engine's Intl locale data.
 */
export function formatCount(n: number): string {
  const digits = Math.round(n).toString();
  if (digits.length <= 3) return digits;
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${rest},${last3}`;
}
