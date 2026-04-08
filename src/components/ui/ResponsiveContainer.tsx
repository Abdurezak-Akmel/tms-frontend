import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type ResponsiveContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Maximum width for different screen sizes */
  maxWidth?: {
    mobile?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    tablet?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    desktop?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  };
  /** Padding for different screen sizes */
  padding?: {
    mobile?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    tablet?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    desktop?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  };
  /** Center content */
  center?: boolean;
};

const maxWidthMap = {
  mobile: {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  },
  tablet: {
    sm: 'md:max-w-sm',
    md: 'md:max-w-md',
    lg: 'md:max-w-lg',
    xl: 'md:max-w-xl',
    full: 'md:max-w-full',
  },
  desktop: {
    sm: 'lg:max-w-sm',
    md: 'lg:max-w-md',
    lg: 'lg:max-w-lg',
    xl: 'lg:max-w-xl',
    full: 'lg:max-w-full',
  },
};

const paddingMap = {
  mobile: {
    none: '',
    sm: 'px-2 py-2',
    md: 'px-4 py-4',
    lg: 'px-6 py-6',
    xl: 'px-8 py-8',
  },
  tablet: {
    none: 'md:px-0 md:py-0',
    sm: 'md:px-4 md:py-4',
    md: 'md:px-6 md:py-6',
    lg: 'md:px-8 md:py-8',
    xl: 'md:px-12 md:py-12',
  },
  desktop: {
    none: 'lg:px-0 lg:py-0',
    sm: 'lg:px-6 lg:py-6',
    md: 'lg:px-8 lg:py-8',
    lg: 'lg:px-12 lg:py-12',
    xl: 'lg:px-16 lg:py-16',
  },
};

export function ResponsiveContainer({
  className,
  children,
  maxWidth = { mobile: 'md', tablet: 'lg', desktop: 'xl' },
  padding = { mobile: 'sm', tablet: 'md', desktop: 'lg' },
  center = false,
  ...props
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        maxWidthMap.mobile[maxWidth.mobile || 'md'],
        maxWidthMap.tablet[maxWidth.tablet || 'lg'],
        maxWidthMap.desktop[maxWidth.desktop || 'xl'],
        paddingMap.mobile[padding.mobile || 'sm'],
        paddingMap.tablet[padding.tablet || 'md'],
        paddingMap.desktop[padding.desktop || 'lg'],
        center && 'mx-auto',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
