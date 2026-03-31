import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Code2,
  Layers,
  LineChart,
  MessageSquare,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { courseService, type Course } from '../../services/courseService';
import { landingVideoService, type LandingVideo } from '../../services/landingVideoService';
import { projectService, type Project } from '../../services/projectService';
import { faqService, type FAQ } from '../../services/faqService';
import { Callout } from '../feedback/Callout';
import { Stack } from '../layout/Stack';
import { Container } from '../layout/Container';
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
import { SectionIntro, SectionShell } from './SectionShell';

const TECH = [
  { name: 'React', detail: 'Components & hooks' },
  { name: 'TypeScript', detail: 'Typed, safer code' },
  { name: 'Node.js', detail: 'APIs & backends' },
  { name: 'REST & APIs', detail: 'Integration patterns' },
  { name: 'Postman', detail: 'API Testing' },
  { name: 'Git & Git Hub', detail: 'Ship with confidence' },
  { name: 'SQL & data', detail: 'Modeling & queries' },
  { name: 'Vercel and Render', detail: 'Deployment and Production' },
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
    title: 'Architectural Thninking - not only tools and tech stacks',
    description:
      'You learn how to assemble components not how to write javascript code',
    icon: MessageSquare,
  },
  {
    title: 'Progress you can see',
    description:
      'Everything is clear why you do it. You will not be told to do it only.',
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
    title: 'Enroll & Tech The Free Pre-Request Course',
    text: 'Create your account, pick the course, and enjoy it  for free.',
  },
  {
    step: '02',
    title: 'Upgrade to the paid courses',
    text: 'Short lessons, project-based, and checkpoints to lock in concepts.',
  },
  {
    step: '03',
    title: 'Never Forget Practicing',
    text: 'Apply skills in scoped projects with clear criteria.',
  },
  {
    step: '04',
    title: 'Begin Your Work',
    text: 'Prepare your website, github and portfolio to win a job.',
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
            <span className="gradient-text dark:from-indigo-400 dark:to-violet-400">clarity and momentum</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
            Short and exciting lessons with guided projects—so you move from
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
          <Callout variant="info" className="mx-auto max-w-xl text-left shadow-sm dark:bg-sky-900/40 dark:border-sky-800/60 dark:text-sky-100">
            <strong className="font-semibold text-sky-950 dark:text-sky-300">By creating your account, get free course on HTML, CSS and Fundamental os Javascript.</strong>{' '} They are pre-requests for the paid full stack development course —upgrade when you want full courses.
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
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/50 text-[var(--color-brand)] dark:text-brand-400">
                  <Layers className="size-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <CardTitle className="text-base dark:text-slate-100">{t.name}</CardTitle>
                  <CardDescription className="dark:text-slate-400">{t.detail}</CardDescription>
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAllCourses();
        if (response.success && response.courses) {
          setCourses(response.courses);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <SectionShell id="courses">
        <SectionIntro
          eyebrow="Featured courses"
          title="Learning paths that build on each other"
          description="Pick a track—each course includes modules, checkpoints, and a capstone project."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-80 animate-pulse bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </SectionShell>
    );
  }

  if (courses.length === 0) {
    return (
      <SectionShell id="courses">
        <SectionIntro
          eyebrow="Featured courses"
          title="Learning paths that build on each other"
          description="Pick a track—each course includes modules, checkpoints, and a capstone project."
        />
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">No courses available at the moment. Please check back later!</p>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell id="courses">
      <SectionIntro
        eyebrow="Featured courses"
        title="Learning paths that build on each other"
        description="Pick a course—each course includes modules, exciting video tutorials, and a project or more."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {courses.map((c) => (
          <Card
            key={c.course_id}
            padding="none"
            className="flex flex-col overflow-hidden border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/90 to-violet-50/60 dark:from-indigo-900/20 dark:to-violet-900/10 px-6 py-5">
              <Badge variant="outline" className="mb-3 bg-white/80 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300">
                {c.category || 'Course'}
              </Badge>
              <CardTitle className="text-xl dark:text-slate-100">{c.title}</CardTitle>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                {c.description || 'Access modern learning materials, videos, and projects to master this subject.'}
              </p>
            </div>
            <CardContent className="flex flex-1 flex-col px-6 pt-5">
              <ul className="flex list-none flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  {courseService.formatLevel(c.level)}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  Self-paced learning · Structured topics
                </li>
                <li className="flex gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  Price: {c.price || 'Free'}
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto border-t border-slate-100 dark:border-slate-800 px-6 pb-6">
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
              <div className="flex size-11 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 text-white dark:text-brand-400">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <CardTitle className="mt-4 text-lg dark:text-slate-100">{b.title}</CardTitle>
              <CardDescription className="mt-2 leading-relaxed dark:text-slate-400">
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
  const [videos, setVideos] = useState<LandingVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await landingVideoService.getAllLandingVideos();
        if (response.success && response.videos) {
          setVideos(response.videos);
        }
      } catch (error) {
        console.error('Failed to fetch landing videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Helper to extract YouTube ID
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <SectionShell id="how">
      <SectionIntro
        eyebrow="How it works"
        title="A simple learning loop"
        description="From enrollment to portfolio pieces—each step has a clear purpose."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <Card key={s.step} padding="md" className="border-slate-200/80 dark:border-slate-800 shadow-sm dark:bg-slate-900">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand)] dark:text-brand-400">
              {s.step}
            </span>
            <CardTitle className="mt-3 text-lg dark:text-slate-100">{s.title}</CardTitle>
            <CardDescription className="mt-2 leading-relaxed dark:text-slate-400">{s.text}</CardDescription>
          </Card>
        ))}
      </div>

      {/* Landing Videos Section */}
      <div className="mt-20 border-t border-slate-100 dark:border-slate-800 pt-16">
        <SectionIntro
          eyebrow="Platform in action"
          title="See how we teach"
          description="A selection of video lessons and platform walkthroughs to get you started."
          className="mb-12"
        />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="aspect-video animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card
                key={video.land_video_id}
                padding="none"
                className="group overflow-hidden border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="aspect-video relative bg-slate-100 dark:bg-slate-800">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${getVideoId(video.youtube_url)}`}
                    title={video.title || "Landing Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-indigo-50/50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-none px-2 py-0 text-[10px] font-bold uppercase">
                      Video Lesson
                    </Badge>
                    {video.duration && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {video.duration} min
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base font-semibold dark:text-slate-100 line-clamp-1 group-hover:text-[var(--color-brand)] transition-colors">
                    {video.title || "Untitled Video"}
                  </CardTitle>
                  {video.description && (
                    <CardDescription className="mt-1.5 text-sm dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </CardDescription>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700">
            <Video className="mx-auto size-8 text-slate-400 mb-3 opacity-50" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Preview videos are arriving soon. Stay tuned!</p>
          </div>
        )}
      </div>
    </SectionShell>
  );
}

export function ProjectShowcaseSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        if (response.success && response.projects) {
          setProjects(response.projects);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <SectionShell id="projects" tone="muted">
        <SectionIntro
          eyebrow="Project-based learning"
          title="Ship real work—not toy demos"
          description="While simple, projects mirror real constraints: APIs, auth, roles, and user-facing polish."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </SectionShell>
    );
  }

  if (projects.length === 0) {
    return (
      <SectionShell id="projects" tone="muted">
        <SectionIntro
          eyebrow="Project-based learning"
          title="Ship real work—not toy demos"
          description="While simple, projects mirror real constraints: APIs, auth, roles, and user-facing polish."
        />
        <div className="text-center py-12 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-700">
          <Code2 className="mx-auto size-8 text-slate-400 mb-3 opacity-50" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Exciting portfolio projects are on the way. Check back soon!
          </p>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell id="projects" tone="muted">
      <SectionIntro
        eyebrow="Project-based learning"
        title="Ship real work—not toy demos"
        description="While simple, projects mirror real constraints: APIs, auth, roles, and user-facing polish."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {projects.map((p) => (
          <Card
            key={p.project_id}
            padding="md"
            className="border-slate-200/80 transition-shadow hover:shadow-md"
          >
            <CardHeader className="border-0 pb-2">
              <Stack direction="row" gap="sm" wrap className="flex-wrap">
                {p.category && (
                  <Badge variant="outline" className="dark:border-slate-700 dark:text-slate-300">
                    {p.category}
                  </Badge>
                )}
                {p.level && (
                  <Badge variant="outline" className="dark:border-slate-700 dark:text-slate-300">
                    {projectService.formatLevel(p.level)}
                  </Badge>
                )}
              </Stack>
              <CardTitle className="pt-2 text-lg dark:text-slate-100">{p.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {p.description || 'A hands-on project to master real-world engineering constraints.'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

export function FaqSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await faqService.getAllFAQs();
        if (response.success && response.faqs) {
          setFaqs(response.faqs);
        }
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (isLoading) {
    return (
      <SectionShell id="faq" tone="muted">
        <SectionIntro
          eyebrow="FAQ"
          title="Answers before you enroll"
          description="Still unsure? These cover the most common questions."
        />
        <Card padding="none" className="mx-auto max-w-3xl divide-y divide-slate-200 dark:divide-slate-800 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 px-4 py-4" />
          ))}
        </Card>
      </SectionShell>
    );
  }

  if (faqs.length === 0) {
    return (
      <SectionShell id="faq" tone="muted">
        <SectionIntro
          eyebrow="FAQ"
          title="Answers before you enroll"
          description="Still unsure? These cover the most common questions."
        />
        <div className="mx-auto max-w-3xl text-center py-12 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-700">
          <MessageSquare className="mx-auto size-8 text-slate-400 mb-3 opacity-50" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Frequently asked questions will appear here soon. Stay tuned!
          </p>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell id="faq" tone="muted">
      <SectionIntro
        eyebrow="FAQ"
        title="Answers before you enroll"
        description="Still unsure? These cover the most common questions."
      />
      <Card padding="none" className="mx-auto max-w-3xl divide-y divide-slate-200 dark:divide-slate-800 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {faqs.map((item) => (
          <details
            key={item.faqs_id}
            className="group px-4 py-1 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
              {item.question}
              <ChevronDown
                className="size-4 shrink-0 text-slate-400 transition group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {item.answer}
            </p>
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
