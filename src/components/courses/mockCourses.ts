import type { CourseSummary } from './types';

/** Static catalog for UI only — replace with API data when ready */
export const MOCK_COURSES: CourseSummary[] = [
  {
    id: '1',
    title: 'Frontend fundamentals',
    shortDescription:
      'HTML, CSS, JavaScript, and React basics with hands-on components and state management.',
    category: 'Web',
    level: 'Beginner',
    duration: '8 weeks',
    moduleCount: 12,
  },
  {
    id: '2',
    title: 'Backend essentials',
    shortDescription:
      'REST APIs, authentication, and databases with Node-style patterns and best practices.',
    category: 'Backend',
    level: 'Intermediate',
    duration: '10 weeks',
    moduleCount: 14,
  },
  {
    id: '3',
    title: 'Database design & SQL',
    shortDescription:
      'Modeling data, normalization, queries, and performance tips for real applications.',
    category: 'Data',
    level: 'Beginner',
    duration: '6 weeks',
    moduleCount: 9,
  },
  {
    id: '4',
    title: 'DevOps & deployment',
    shortDescription:
      'CI/CD, containers, and cloud deployment with a practical pipeline project.',
    category: 'Operations',
    level: 'Intermediate',
    duration: '7 weeks',
    moduleCount: 10,
  },
  {
    id: '5',
    title: 'UI/UX for developers',
    shortDescription:
      'Layout systems, accessibility, and design handoff so your interfaces feel professional.',
    category: 'Design',
    level: 'Beginner',
    duration: '5 weeks',
    moduleCount: 8,
  },
  {
    id: '6',
    title: 'Advanced system design',
    shortDescription:
      'Scalability, caching, queues, and trade-offs for large-scale tutorial platforms.',
    category: 'Architecture',
    level: 'Advanced',
    duration: '12 weeks',
    moduleCount: 16,
  },
];
