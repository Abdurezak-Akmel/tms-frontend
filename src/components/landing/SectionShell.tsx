import { type HTMLAttributes, type ReactNode } from 'react';
import { Container } from '../layout/Container';
import { cn } from '../../utils/cn';

export type SectionShellProps = HTMLAttributes<HTMLElement> & {
  id: string;
  children: ReactNode;
  /** Visual background */
  tone?: 'default' | 'muted' | 'dark';
};

const toneMap = {
  default: 'bg-transparent',
  muted: 'bg-slate-50/80 dark:bg-slate-900/50',
  dark: 'bg-slate-900 text-white [&_.section-eyebrow]:text-indigo-300 [&_h2]:text-white [&_.section-desc]:text-slate-300',
};

export function SectionShell({
  id,
  children,
  className,
  tone = 'default',
  ...props
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-20 py-16 sm:py-20 md:py-24',
        toneMap[tone],
        className,
      )}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}

export type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  className?: string;
  /** Use on dark section backgrounds (e.g. tone="dark") */
  inverse?: boolean;
};

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = 'center',
  inverse = false,
  className,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        'mb-12 max-w-2xl space-y-3 md:mb-16',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      <p
        className={cn(
          'section-eyebrow text-xs font-semibold uppercase tracking-widest',
          inverse ? 'text-indigo-300' : 'text-[var(--color-brand)] dark:text-brand-400',
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          'text-3xl font-semibold tracking-tight sm:text-4xl',
          inverse ? 'text-white' : 'text-slate-900 dark:text-slate-100',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'section-desc text-lg',
            inverse ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
