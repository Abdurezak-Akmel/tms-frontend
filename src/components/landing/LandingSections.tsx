import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Code2,
  GraduationCap,
  Layers,
  LineChart,
  MessageSquare,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { Callout } from '../feedback/Callout';
import { Stack } from '../layout/Stack';
import { Container } from '../layout/Container';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { ButtonLink } from '../ui/ButtonLink';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/Card';
import { Separator } from '../ui/Separator';
import { cn } from '../../utils/cn';
import { SectionIntro, SectionShell } from './SectionShell';

const TECH = [
  { name: 'React', detail: 'Components & hooks' },
  { name: 'TypeScript', detail: 'Typed, safer code' },
  { name: 'Node.js', detail: 'APIs & backends' },
  { name: 'REST & APIs', detail: 'Integration patterns' },
  { name: 'Git & CI', detail: 'Ship with confidence' },
  { name: 'SQL & data', detail: 'Modeling & queries' },
] as const;

const COURSES = [
  {
    title: 'Full-Stack Web Foundations',
    level: 'Beginner → Intermediate',
    duration: '8 weeks',
    modules: '12 modules',
    blurb: 'HTML to React, routing, forms, and auth—then connect to a real API.',
    path: 'Web Development',
  },
  {
    title: 'APIs & Backend Services',
    level: 'Intermediate',
    duration: '6 weeks',
    modules: '9 modules',
    blurb: 'Design REST endpoints, validation, errors, and deployment patterns.',
    path: 'Backend',
  },
  {
    title: 'Frontend Architecture',
    level: 'Intermediate',
    duration: '5 weeks',
    modules: '8 modules',
    blurb: 'State, performance, testing, and maintainable UI patterns.',
    path: 'Frontend',
  },
] as const;

const BENEFITS = [
  {
    title: 'Structured curriculum',
    description:
      'Clear modules and checkpoints so you always know what to learn next.',
    icon: BookOpen,
  },
  {
    title: 'Hands-on projects',
    description:
      'Build portfolio-ready work—not passive videos—every week.',
    icon: Code2,
  },
  {
    title: 'Instructor feedback',
    description:
      'Ask questions and get guidance when you are stuck on real problems.',
    icon: MessageSquare,
  },
  {
    title: 'Progress you can see',
    description:
      'Track lessons, submissions, and milestones in one dashboard.',
    icon: LineChart,
  },
  {
    title: 'Role-aware access',
    description:
      'Learners and admins get the right tools—without clutter.',
    icon: Users,
  },
  {
    title: 'Materials in one place',
    description:
      'Videos, files, and course notes organized per course.',
    icon: Video,
  },
] as const;

const STEPS = [
  {
    step: '01',
    title: 'Enroll & orient',
    text: 'Create your account, pick a path, and review the syllabus.',
  },
  {
    step: '02',
    title: 'Learn & practice',
    text: 'Short lessons, exercises, and checkpoints to lock in concepts.',
  },
  {
    step: '03',
    title: 'Ship projects',
    text: 'Apply skills in scoped projects with clear criteria.',
  },
  {
    step: '04',
    title: 'Review & iterate',
    text: 'Get feedback, refine your work, and document outcomes.',
  },
] as const;

const PROJECTS = [
  {
    title: 'Course catalog & enrollment',
    tags: ['React', 'Routing', 'Forms'],
    summary:
      'Build a public catalog with filters and a guided enrollment flow.',
  },
  {
    title: 'Auth & receipts API',
    tags: ['Node', 'Validation', 'Security'],
    summary:
      'Implement sign-in, protected routes, and receipt uploads with validation.',
  },
  {
    title: 'Admin dashboard',
    tags: ['Analytics', 'Roles', 'UI'],
    summary:
      'Surface metrics, manage users, and approve access requests with role-aware UI.',
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      'The project-based pacing made the difference—I finally shipped features I could show in interviews.',
    name: 'Aisha M.',
    role: 'Career switcher',
  },
  {
    quote:
      'Clear modules and materials in one place. I spent time learning, not hunting for files.',
    name: 'Jordan R.',
    role: 'Self-taught developer',
  },
  {
    quote:
      'Feedback was actionable. I knew what to fix and why, not just “looks good.”',
    name: 'Sam K.',
    role: 'Bootcamp graduate',
  },
] as const;

const STATS = [
  { label: 'Learners supported', value: '12k+' },
  { label: 'Project submissions', value: '48k+' },
  { label: 'Avg. lesson completion', value: '87%' },
] as const;

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Explore the platform and preview select lessons.',
    features: ['Course previews', 'Community access', 'Email support'],
    cta: 'Create free account',
    href: '/register',
    variant: 'outline' as const,
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'Full courses, projects, and progress tracking.',
    features: [
      'All courses & modules',
      'Project reviews & feedback',
      'Certificates of completion',
      'Priority support',
    ],
    cta: 'Start learning',
    href: '/register',
    variant: 'primary' as const,
    highlighted: true,
  },
  {
    name: 'Team',
    price: 'Custom',
    period: '',
    description: 'For schools and cohorts with admin workflows.',
    features: [
      'Role-based access',
      'Bulk enrollment',
      'Reports & analytics',
      'Dedicated success manager',
    ],
    cta: 'Contact sales',
    href: '/register',
    variant: 'outline' as const,
    highlighted: false,
  },
] as const;

const FAQS = [
  {
    q: 'Do I need prior experience?',
    a: 'Some paths assume no prior programming; others work best if you know basics. Each course lists prerequisites up front.',
  },
  {
    q: 'Do I get lifetime access?',
    a: 'Paid plans include access for the subscription period. Free previews remain available on the Starter tier.',
  },
  {
    q: 'Are projects graded?',
    a: 'Projects include rubrics and feedback checkpoints. You submit work and iterate based on instructor notes.',
  },
  {
    q: 'Can teams or schools use this?',
    a: 'Yes—Team plans include admin tools, role management, and reporting tailored for cohorts.',
  },
  {
    q: 'What if I get stuck?',
    a: 'Use the discussion areas and structured help channels. Pro learners get priority responses.',
  },
] as const;

export function LandingHero() {
  return (
    <section
      id="hero"
      className="relative scroll-mt-20 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-indigo-50/40 to-[var(--color-surface)]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <Container className="relative py-16 sm:py-20 md:py-28 lg:py-32">
        <Stack gap="lg" align="center" className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="border-indigo-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-indigo-800 shadow-sm backdrop-blur">
            <Sparkles className="mr-1.5 inline size-3.5 text-[var(--color-brand)]" aria-hidden />
            Project-based learning • Structured paths • Real outcomes
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Learn modern skills with{' '}
            <span className="gradient-text">clarity and momentum</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 sm:text-xl">
            Short lessons, guided projects, and instructor feedback—so you move from
            theory to shipped work without losing the thread.
          </p>
          <Stack
            direction="row"
            gap="md"
            align="center"
            justify="center"
            wrap
            className="w-full pt-2"
          >
            <ButtonLink
              to="/register"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="size-4" />}
            >
              Start free
            </ButtonLink>
            <ButtonLink to="/user-login" variant="outline" size="lg">
              I already have an account
            </ButtonLink>
          </Stack>
          <Callout variant="info" className="mx-auto max-w-xl text-left shadow-sm">
            <strong className="font-semibold text-sky-950">Starter is free.</strong>{' '}
            No credit card required—upgrade when you want full courses and feedback.
          </Callout>
        </Stack>
      </Container>
    </section>
  );
}

export function TechStackSection() {
  return (
    <SectionShell id="learn" tone="muted">
      <SectionIntro
        eyebrow="What you’ll learn"
        title="A practical stack for today’s web"
        description="We focus on tools employers actually use—taught in context, not in isolation."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TECH.map((t) => (
          <Card
            key={t.name}
            padding="md"
            className="border-slate-200/80 transition-shadow hover:shadow-md"
          >
            <CardHeader className="border-0 pb-0">
              <Stack direction="row" gap="sm" align="center">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[var(--color-brand)]">
                  <Layers className="size-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  <CardDescription>{t.detail}</CardDescription>
                </div>
              </Stack>
            </CardHeader>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

export function FeaturedCoursesSection() {
  return (
    <SectionShell id="courses">
      <SectionIntro
        eyebrow="Featured courses"
        title="Learning paths that build on each other"
        description="Pick a track—each course includes modules, checkpoints, and a capstone project."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {COURSES.map((c) => (
          <Card
            key={c.title}
            padding="none"
            className="flex flex-col overflow-hidden border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/90 to-violet-50/60 px-6 py-5">
              <Badge variant="outline" className="mb-3 bg-white/80">
                {c.path}
              </Badge>
              <CardTitle className="text-xl">{c.title}</CardTitle>
              <p className="mt-2 text-sm text-slate-600">{c.blurb}</p>
            </div>
            <CardContent className="flex flex-1 flex-col px-6 pt-5">
              <ul className="flex list-none flex-col gap-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  {c.level}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  {c.duration} · {c.modules}
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto border-t border-slate-100 px-6 pb-6">
              <ButtonLink
                to="/register"
                variant="outline"
                size="md"
                className="w-full justify-center"
              >
                View syllabus
              </ButtonLink>
            </CardFooter>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

export function WhyChooseUsSection() {
  return (
    <SectionShell id="why" tone="muted">
      <SectionIntro
        eyebrow="Why choose us"
        title="Built for outcomes—not endless content"
        description="Everything is designed to keep you moving: structure, practice, and feedback in one loop."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b) => {
          const Icon = b.icon;
          return (
            <Card
              key={b.title}
              padding="md"
              className="border-slate-200/80 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <CardTitle className="mt-4 text-lg">{b.title}</CardTitle>
              <CardDescription className="mt-2 leading-relaxed">
                {b.description}
              </CardDescription>
            </Card>
          );
        })}
      </div>
    </SectionShell>
  );
}

export function HowItWorksSection() {
  return (
    <SectionShell id="how">
      <SectionIntro
        eyebrow="How it works"
        title="A simple learning loop"
        description="From enrollment to portfolio pieces—each step has a clear purpose."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <Card key={s.step} padding="md" className="border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand)]">
              {s.step}
            </span>
            <CardTitle className="mt-3 text-lg">{s.title}</CardTitle>
            <CardDescription className="mt-2 leading-relaxed">{s.text}</CardDescription>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

export function ProjectShowcaseSection() {
  return (
    <SectionShell id="projects" tone="muted">
      <SectionIntro
        eyebrow="Project-based learning"
        title="Ship real work—not toy demos"
        description="Projects mirror real constraints: APIs, auth, roles, and user-facing polish."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <Card
            key={p.title}
            padding="md"
            className="border-slate-200/80 transition-shadow hover:shadow-md"
          >
            <CardHeader className="border-0 pb-2">
              <Stack direction="row" gap="sm" wrap className="flex-wrap">
                {p.tags.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </Stack>
              <CardTitle className="pt-2 text-lg">{p.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-600">{p.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

export function TestimonialsSection() {
  return (
    <SectionShell id="testimonials">
      <SectionIntro
        eyebrow="Student success"
        title="What learners say"
        description="Anonymous feedback from recent cohorts—focused on outcomes and clarity."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <Card
            key={t.name}
            padding="md"
            className="border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50"
          >
            <CardContent className="pt-2">
              <p className="text-slate-700">&ldquo;{t.quote}&rdquo;</p>
              <Separator className="my-6" />
              <Stack direction="row" gap="md" align="center">
                <Avatar fallback={t.name} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

export function CredibilitySection() {
  return (
    <SectionShell id="credibility" tone="dark" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.35), transparent)',
        }}
        aria-hidden
      />
      <div className="relative">
        <SectionIntro
          eyebrow="Instructor & platform"
          title="Credibility you can verify"
          description="Curriculum is maintained by practitioners who ship software—not just teach slides. The platform is built for real classrooms, audits, and cohorts at scale."
          inverse
        />

        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {STATS.map((s) => (
            <Card
              key={s.label}
              padding="md"
              className="border-slate-700/80 bg-slate-800/40 text-center text-white backdrop-blur"
            >
              <p className="text-3xl font-semibold sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-slate-400">{s.label}</p>
            </Card>
          ))}
        </div>

        <Card
          padding="lg"
          className="mt-10 border-slate-700/80 bg-slate-800/30 backdrop-blur"
        >
          <Stack
            direction="row"
            gap="lg"
            align="start"
            className="flex-col sm:flex-row sm:items-start"
          >
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-lg">
              <GraduationCap className="size-10" strokeWidth={1.5} />
            </div>
            <Stack gap="sm" className="min-w-0 text-center sm:text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
                Lead instructor
              </p>
              <CardTitle className="text-xl text-white">
                Experienced engineers & educators
              </CardTitle>
              <CardDescription className="text-slate-300">
                Materials are reviewed for accuracy, pacing, and accessibility. Admin
                tooling helps instructors focus on teaching—while you focus on building.
              </CardDescription>
            </Stack>
          </Stack>
        </Card>
      </div>
    </SectionShell>
  );
}

export function PricingSection() {
  return (
    <SectionShell id="pricing">
      <SectionIntro
        eyebrow="Pricing"
        title="Access plans that match your pace"
        description="Start free, upgrade when you want full courses and feedback."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            padding="md"
            className={cn(
              'flex flex-col border-slate-200/80',
              plan.highlighted &&
                'relative border-indigo-300 shadow-lg ring-2 ring-[var(--color-brand)]/25',
            )}
          >
            {plan.highlighted ? (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand)]">
                Most popular
              </Badge>
            ) : null}
            <CardHeader className="border-0 pb-2">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-slate-900">
                  {plan.price}
                </span>
                {plan.period ? (
                  <span className="text-sm text-slate-500">/{plan.period}</span>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <ul className="space-y-2.5 text-sm text-slate-600">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto border-0 pt-0">
              <ButtonLink
                to={plan.href}
                variant={plan.variant}
                size="md"
                className="w-full justify-center"
              >
                {plan.cta}
              </ButtonLink>
            </CardFooter>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

export function FaqSection() {
  return (
    <SectionShell id="faq" tone="muted">
      <SectionIntro
        eyebrow="FAQ"
        title="Answers before you enroll"
        description="Still unsure? These cover the most common questions."
      />
      <Card padding="none" className="mx-auto max-w-3xl divide-y divide-slate-200 border-slate-200/80 shadow-sm">
        {FAQS.map((item) => (
          <details
            key={item.q}
            className="group px-4 py-1 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-slate-900">
              {item.q}
              <ChevronDown
                className="size-4 shrink-0 text-slate-400 transition group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="pb-4 text-sm leading-relaxed text-slate-600">{item.a}</p>
          </details>
        ))}
      </Card>
    </SectionShell>
  );
}

export function FinalCtaSection() {
  return (
    <section
      id="cta"
      className="scroll-mt-20 border-t border-indigo-200/50 bg-gradient-to-br from-[var(--color-brand)] via-indigo-600 to-violet-700 py-16 text-white sm:py-20"
    >
      <Container>
        <Stack gap="lg" align="center" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to start learning?
          </h2>
          <p className="text-lg text-indigo-100">
            Create your account in minutes. Preview courses on Starter—or unlock full
            access when you are ready.
          </p>
          <Stack
            direction="row"
            gap="md"
            align="center"
            justify="center"
            wrap
            className="w-full pt-2"
          >
            <ButtonLink
              to="/register"
              variant="secondary"
              size="lg"
              className="bg-white text-[var(--color-brand)] hover:bg-slate-100"
              rightIcon={<ArrowRight className="size-4" />}
            >
              Start learning
            </ButtonLink>
            <ButtonLink
              to="/user-login"
              variant="outline"
              size="lg"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              Sign in
            </ButtonLink>
          </Stack>
        </Stack>
      </Container>
    </section>
  );
}
