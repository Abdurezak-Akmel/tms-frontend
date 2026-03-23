/**
 * Joins class names, skipping falsy values. Use for conditional Tailwind classes.
 */
export function cn(
  ...classes: Array<string | undefined | null | false>
): string {
  return classes.filter(Boolean).join(' ');
}
