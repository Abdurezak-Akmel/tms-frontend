import { type ImgHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type AvatarProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Single letter or two initials when image is absent */
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-lg',
};

export function Avatar({
  className,
  src,
  alt = '',
  fallback,
  size = 'md',
  ...props
}: AvatarProps) {
  const initial =
    fallback?.trim().slice(0, 2).toUpperCase() ||
    alt?.trim().slice(0, 1).toUpperCase() ||
    '?';

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'inline-block shrink-0 rounded-full object-cover ring-2 ring-white',
          sizeMap[size],
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={alt || fallback || 'User avatar'}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-violet-600 font-semibold text-white ring-2 ring-white',
        sizeMap[size],
        className,
      )}
    >
      {initial}
    </span>
  );
}
