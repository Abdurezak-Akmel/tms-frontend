import { type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  /** Max width preset */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

const maxWidth: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
};

export function Container({
  className,
  size = 'xl',
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', maxWidth[size], className)}
      {...props}
    />
  );
}
