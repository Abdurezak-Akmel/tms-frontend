import { type ReactNode } from 'react';
import { NavLink, type NavLinkProps } from 'react-router-dom';
import { cn } from '../../utils/cn';

export type AppNavLinkProps = Omit<NavLinkProps, 'className'> & {
  className?: string;
  inactiveClassName?: string;
  activeClassName?: string;
  children?: ReactNode;
};

const base =
  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors';

const defaultInactive = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
const defaultActive =
  'bg-indigo-50 text-[var(--color-brand)] ring-1 ring-indigo-100';

export function AppNavLink({
  className,
  inactiveClassName,
  activeClassName,
  children,
  ...props
}: AppNavLinkProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          base,
          isActive
            ? cn(defaultActive, activeClassName)
            : cn(defaultInactive, inactiveClassName),
          className,
        )
      }
      {...props}
    >
      {children}
    </NavLink>
  );
}
