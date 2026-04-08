import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type ResponsiveGridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Grid columns for mobile (default: 1) */
  cols?: {
    mobile?: 1 | 2;
    tablet?: 1 | 2 | 3 | 4;
    desktop?: 1 | 2 | 3 | 4 | 5 | 6;
  };
  /** Gap between grid items (default: 'md') */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Enable responsive spacing (default: true) */
  responsive?: boolean;
};

const colsMap = {
  mobile: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
  },
  tablet: {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  },
  desktop: {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  },
};

const gapMap = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export function ResponsiveGrid({
  className,
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  responsive = true,
  ...props
}: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        'grid',
        colsMap.mobile[cols.mobile || 1],
        responsive && colsMap.tablet[cols.tablet || 2],
        responsive && colsMap.desktop[cols.desktop || 3],
        gapMap[gap],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type ResponsiveFlexProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Flex direction for different screen sizes */
  direction?: {
    mobile?: 'row' | 'col';
    tablet?: 'row' | 'col';
    desktop?: 'row' | 'col';
  };
  /** Justify content for different screen sizes */
  justify?: {
    mobile?: 'start' | 'center' | 'end' | 'between';
    tablet?: 'start' | 'center' | 'end' | 'between';
    desktop?: 'start' | 'center' | 'end' | 'between';
  };
  /** Align items for different screen sizes */
  align?: {
    mobile?: 'start' | 'center' | 'end' | 'stretch';
    tablet?: 'start' | 'center' | 'end' | 'stretch';
    desktop?: 'start' | 'center' | 'end' | 'stretch';
  };
  /** Gap between items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Wrap items */
  wrap?: boolean;
};

const directionMap = {
  mobile: {
    row: 'flex-row',
    col: 'flex-col',
  },
  tablet: {
    row: 'md:flex-row',
    col: 'md:flex-col',
  },
  desktop: {
    row: 'lg:flex-row',
    col: 'lg:flex-col',
  },
};

const justifyMap = {
  mobile: {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  },
  tablet: {
    start: 'md:justify-start',
    center: 'md:justify-center',
    end: 'md:justify-end',
    between: 'md:justify-between',
  },
  desktop: {
    start: 'lg:justify-start',
    center: 'lg:justify-center',
    end: 'lg:justify-end',
    between: 'lg:justify-between',
  },
};

const alignMap = {
  mobile: {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  },
  tablet: {
    start: 'md:items-start',
    center: 'md:items-center',
    end: 'md:items-end',
    stretch: 'md:items-stretch',
  },
  desktop: {
    start: 'lg:items-start',
    center: 'lg:items-center',
    end: 'lg:items-end',
    stretch: 'lg:items-stretch',
  },
};

export function ResponsiveFlex({
  className,
  children,
  direction = { mobile: 'col', tablet: 'row', desktop: 'row' },
  justify = { mobile: 'start', tablet: 'center', desktop: 'start' },
  align = { mobile: 'stretch', tablet: 'center', desktop: 'stretch' },
  gap = 'md',
  wrap = false,
  ...props
}: ResponsiveFlexProps) {
  return (
    <div
      className={cn(
        'flex',
        directionMap.mobile[direction.mobile || 'col'],
        directionMap.tablet[direction.tablet || 'row'],
        directionMap.desktop[direction.desktop || 'row'],
        justifyMap.mobile[justify.mobile || 'start'],
        justifyMap.tablet[justify.tablet || 'center'],
        justifyMap.desktop[justify.desktop || 'start'],
        alignMap.mobile[align.mobile || 'stretch'],
        alignMap.tablet[align.tablet || 'center'],
        alignMap.desktop[align.desktop || 'stretch'],
        gapMap[gap],
        wrap && 'flex-wrap',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
