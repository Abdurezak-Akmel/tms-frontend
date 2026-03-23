import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ButtonLink } from '../ui/ButtonLink';
import { Container } from '../layout/Container';
import { cn } from '../../utils/cn';

const NAV = [
  { label: 'What you learn', href: '#learn' },
  { label: 'Courses', href: '#courses' },
  { label: 'Why us', href: '#why' },
  { label: 'How it works', href: '#how' },
  { label: 'Projects', href: '#projects' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
] as const;

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-slate-900"
        >
          <span
            className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-violet-600 text-sm font-bold text-white shadow-sm"
            aria-hidden
          >
            T
          </span>
          <span className="hidden sm:inline">HabeshaTech</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <ButtonLink to="/user-login" variant="ghost" size="md">
            Sign in
          </ButtonLink>
          <ButtonLink to="/register" variant="primary" size="md">
            Get started
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>

      <div
        id="mobile-nav"
        className={cn(
          'border-t border-slate-200 bg-white lg:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-4">
            <ButtonLink
              to="/user-login"
              variant="outline"
              size="md"
              className="w-full justify-center"
              onClick={() => setOpen(false)}
            >
              Sign in
            </ButtonLink>
            <ButtonLink
              to="/register"
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => setOpen(false)}
            >
              Get started
            </ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  );
}
