import { Link } from 'react-router-dom';
import { Container } from '../layout/Container';

type FooterLinkItem =
  | { label: string; href: string }
  | { label: string; to: string };

const footerLinks: Record<string, FooterLinkItem[]> = {
  Product: [
    { label: 'Courses', href: '#courses' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How it works', href: '#how' },
  ],
  Account: [
    { label: 'Sign in', to: '/user-login' },
    { label: 'Create account', to: '/register' },
    { label: 'Forgot password', to: '/forget-password' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-semibold text-white"
            >
              <span
                className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white"
                aria-hidden
              >
                T
              </span>
              Tutorial LMS
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Structured courses, hands-on projects, and instructor-led support—built
              for serious learners.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((item) => (
                  <li key={item.label}>
                    {'to' in item ? (
                      <Link
                        to={item.to}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Tutorial LMS. All rights reserved.</p>
          <p className="text-slate-600">
            Built for clarity, practice, and outcomes.
          </p>
        </div>
      </Container>
    </footer>
  );
}
