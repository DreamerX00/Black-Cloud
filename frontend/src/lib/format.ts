/**
 * Tiny relative-time formatter.
 * ponytail: date-fns would be 60kb for one function. `Intl.RelativeTimeFormat`
 * covers the standard case; roll our own picker for the biggest unit that fits.
 */
const RTF = new Intl.RelativeTimeFormat("en", { style: "short" });

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
  ["second", 1000],
];

/** Positive strings only — "3 min", "2 days", "just now". */
export function formatDistanceToNowStrict(iso: string): string {
  const target = new Date(iso).getTime();
  const now = Date.now();
  const delta = Math.abs(now - target);
  if (delta < 30_000) return "just now";
  for (const [unit, ms] of UNITS) {
    if (delta >= ms) {
      // Intl formatter returns "in 3 min" for positive numbers; strip that.
      return RTF.format(-Math.round(delta / ms), unit).replace(/^in /, "");
    }
  }
  return "just now";
}
