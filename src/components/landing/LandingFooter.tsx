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
    <footer className="border-t border-slate-100 bg-white text-slate-800">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 font-bold text-black"
            >
              <span
                className="flex size-10 items-center justify-center rounded-xl bg-black text-sm font-black text-white shadow-xl shadow-black/20"
                aria-hidden
              >
                HT
              </span>
              HabeshaTech
            </Link>
            <p className="max-w-xs text-base leading-relaxed text-slate-700 font-medium">
              Structured courses and hands-on projects designed to take you from beginner to professional engineer with clarity.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-black/40">
                {title}
              </h3>
              <ul className="mt-6 space-y-3">
                {links.map((item) => (
                  <li key={item.label}>
                    {'to' in item ? (
                      <Link
                        to={item.to}
                        className="text-sm font-bold text-slate-800 transition-colors hover:text-indigo-600"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="text-sm font-bold text-slate-800 transition-colors hover:text-indigo-600"
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

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-slate-100 pt-10 text-sm font-semibold text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} HabeshaTech LMS. All rights reserved.</p>
          <p className="text-slate-400">
            Built for clarity, practice, and real-world outcomes.
          </p>
        </div>
      </Container>
    </footer>
  );
}
