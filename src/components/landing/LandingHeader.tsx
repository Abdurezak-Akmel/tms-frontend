import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { ButtonLink } from '../ui/ButtonLink';
import { Container } from '../layout/Container';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';

const NAV = [
  { label: 'What you learn', href: '#learn' },
  { label: 'Courses', href: '#courses' },
  { label: 'Why us', href: '#why' },
  { label: 'How it works', href: '#how' },
  { label: 'Projects', href: '#projects' },
  { label: 'FAQ', href: '#faq' },
] as const;

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-black dark:text-slate-100"
        >
          <span
            className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-500/30"
            aria-hidden
          >
            HT
          </span>
          <span className="hidden sm:inline text-xl">HabeshaTech</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-slate-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={toggleTheme}
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle themes"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <ButtonLink to="/user-login" variant="ghost" size="md">
            Sign in
          </ButtonLink>
          <ButtonLink to="/register" variant="primary" size="md">
            Get started
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle themes"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </Container>

      <div
        id="mobile-nav"
        className={cn(
          'border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 lg:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
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
