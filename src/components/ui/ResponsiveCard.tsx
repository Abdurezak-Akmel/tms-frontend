import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type ResponsiveCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Card padding for different screen sizes */
  padding?: {
    mobile?: 'none' | 'sm' | 'md' | 'lg';
    tablet?: 'none' | 'sm' | 'md' | 'lg';
    desktop?: 'none' | 'sm' | 'md' | 'lg';
  };
  /** Card shadow intensity */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  /** Card border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Hover effects */
  hover?: boolean;
  /** Full height on mobile */
  fullHeightMobile?: boolean;
};

const paddingMap = {
  mobile: {
    none: '',
    sm: 'p-2 sm:p-3',
    md: 'p-3 sm:p-4',
    lg: 'p-4 sm:p-6',
  },
  tablet: {
    none: '',
    sm: 'md:p-2 lg:p-3',
    md: 'md:p-3 lg:p-4',
    lg: 'md:p-4 lg:p-6',
  },
  desktop: {
    none: '',
    sm: 'lg:p-3 xl:p-4',
    md: 'lg:p-4 xl:p-6',
    lg: 'lg:p-6 xl:p-8',
  },
};

const shadowMap = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const roundedMap = {
  none: '',
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  '2xl': 'rounded-3xl',
};

export function ResponsiveCard({
  className,
  children,
  padding = { mobile: 'md', tablet: 'md', desktop: 'lg' },
  shadow = 'md',
  rounded = 'lg',
  hover = true,
  fullHeightMobile = false,
  ...props
}: ResponsiveCardProps) {
  return (
    <div
      className={cn(
        'border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200',
        paddingMap.mobile[padding.mobile || 'md'],
        paddingMap.tablet[padding.tablet || 'md'],
        paddingMap.desktop[padding.desktop || 'lg'],
        shadowMap[shadow],
        roundedMap[rounded],
        hover && 'hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700',
        fullHeightMobile && 'sm:min-h-[calc(100vh-8rem)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type ResponsiveCardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Header padding for different screen sizes */
  padding?: {
    mobile?: 'none' | 'sm' | 'md' | 'lg';
    tablet?: 'none' | 'sm' | 'md' | 'lg';
    desktop?: 'none' | 'sm' | 'md' | 'lg';
  };
  /** Border bottom */
  border?: boolean;
};

export function ResponsiveCardHeader({
  className,
  children,
  padding = { mobile: 'md', tablet: 'md', desktop: 'lg' },
  border = true,
  ...props
}: ResponsiveCardHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        paddingMap.mobile[padding.mobile || 'md'],
        paddingMap.tablet[padding.tablet || 'md'],
        paddingMap.desktop[padding.desktop || 'lg'],
        border && 'border-b border-slate-100 dark:border-slate-800',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type ResponsiveCardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
  /** Title size for different screen sizes */
  size?: {
    mobile?: 'sm' | 'md' | 'lg' | 'xl';
    tablet?: 'sm' | 'md' | 'lg' | 'xl';
    desktop?: 'sm' | 'md' | 'lg' | 'xl';
  };
};

const titleSizeMap = {
  mobile: {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  },
  tablet: {
    sm: 'md:text-lg',
    md: 'md:text-xl',
    lg: 'md:text-2xl',
    xl: 'md:text-3xl',
  },
  desktop: {
    sm: 'lg:text-lg',
    md: 'lg:text-xl',
    lg: 'lg:text-2xl',
    xl: 'lg:text-3xl',
  },
};

export function ResponsiveCardTitle({
  className,
  children,
  size = { mobile: 'lg', tablet: 'md', desktop: 'md' },
  ...props
}: ResponsiveCardTitleProps) {
  return (
    <h3
      className={cn(
        'font-bold tracking-tight text-slate-900 dark:text-slate-100',
        titleSizeMap.mobile[size.mobile || 'lg'],
        titleSizeMap.tablet[size.tablet || 'md'],
        titleSizeMap.desktop[size.desktop || 'md'],
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export type ResponsiveCardDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
  /** Description size for different screen sizes */
  size?: {
    mobile?: 'sm' | 'md' | 'lg';
    tablet?: 'sm' | 'md' | 'lg';
    desktop?: 'sm' | 'md' | 'lg';
  };
};

const descriptionSizeMap = {
  mobile: {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  },
  tablet: {
    sm: 'md:text-xs',
    md: 'md:text-sm',
    lg: 'md:text-base',
  },
  desktop: {
    sm: 'lg:text-xs',
    md: 'lg:text-sm',
    lg: 'lg:text-base',
  },
};

export function ResponsiveCardDescription({
  className,
  children,
  size = { mobile: 'md', tablet: 'md', desktop: 'md' },
  ...props
}: ResponsiveCardDescriptionProps) {
  return (
    <p
      className={cn(
        'text-slate-500 dark:text-slate-400 leading-relaxed',
        descriptionSizeMap.mobile[size.mobile || 'md'],
        descriptionSizeMap.tablet[size.tablet || 'md'],
        descriptionSizeMap.desktop[size.desktop || 'md'],
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
