import type { CourseDetail } from './types';

/** Rich course rows for UI — replace with API by course id */
export const MOCK_COURSE_DETAILS: Record<string, CourseDetail> = {
  '1': {
    id: '1',
    title: 'Frontend fundamentals',
    shortDescription:
      'HTML, CSS, JavaScript, and React basics with hands-on components and state management.',
    category: 'Web',
    level: 'Beginner',
    duration: '8 weeks',
    moduleCount: 12,
    currency: 'USD',
    price: 89,
    fullDescription:
      'Build real interfaces step by step: semantic HTML, responsive layout, modern JavaScript, and React fundamentals including hooks, routing, and forms. Each module pairs short lessons with exercises you can submit for feedback.',
    outcomes: [
      'Structure pages with accessible HTML and CSS layout patterns',
      'Use React components, props, state, and hooks effectively',
      'Fetch and display data from APIs in the browser',
      'Prepare a small capstone project for your portfolio',
    ],
    videos: [
      { id: 'v101', title: 'Welcome & toolchain setup', duration: '12:40' },
      { id: 'v102', title: 'CSS layout: flexbox & grid', duration: '24:15' },
      { id: 'v103', title: 'React components & props', duration: '18:22' },
      { id: 'v104', title: 'State & effects with hooks', duration: '31:08' },
    ],
    files: [
      { id: 'f201', name: 'Syllabus-Frontend-2025.pdf', sizeLabel: '240 KB', kind: 'PDF' },
      { id: 'f202', name: 'Starter-code-module-1.zip', sizeLabel: '1.2 MB', kind: 'Archive' },
      { id: 'f203', name: 'Accessibility-checklist.md', sizeLabel: '12 KB', kind: 'Markdown' },
    ],
  },
  '2': {
    id: '2',
    title: 'Backend essentials',
    shortDescription:
      'REST APIs, authentication, and databases with Node-style patterns and best practices.',
    category: 'Backend',
    level: 'Intermediate',
    duration: '10 weeks',
    moduleCount: 14,
    currency: 'USD',
    price: 119,
    fullDescription:
      'Design and implement secure HTTP APIs, handle auth tokens, validate input, and persist data with SQL. Includes patterns for errors, pagination, and deployment considerations.',
    outcomes: [
      'Model resources and routes with consistent JSON responses',
      'Implement login flows and protect endpoints',
      'Write safe queries and migrations against a relational DB',
      'Test endpoints locally and document them for frontend teams',
    ],
    videos: [
      { id: 'v201', title: 'HTTP & REST recap', duration: '15:02' },
      { id: 'v202', title: 'Auth: sessions vs JWT', duration: '28:44' },
      { id: 'v203', title: 'Database modeling workshop', duration: '35:10' },
    ],
    files: [
      { id: 'f301', name: 'Postman-collection.json', sizeLabel: '48 KB', kind: 'JSON' },
      { id: 'f302', name: 'ERD-backend-course.png', sizeLabel: '320 KB', kind: 'Image' },
    ],
  },
  '3': {
    id: '3',
    title: 'Database design & SQL',
    shortDescription:
      'Modeling data, normalization, queries, and performance tips for real applications.',
    category: 'Data',
    level: 'Beginner',
    duration: '6 weeks',
    moduleCount: 9,
    currency: 'USD',
    price: 69,
    fullDescription:
      'From ER diagrams to indexes: learn to normalize schemas, write readable SQL, and spot slow queries before they hit production.',
    outcomes: [
      'Create normalized schemas for common app features',
      'Write joins, aggregations, and subqueries with confidence',
      'Explain query plans at a high level',
    ],
    videos: [
      { id: 'v301', title: 'Entities & relationships', duration: '20:00' },
      { id: 'v302', title: 'SQL joins deep dive', duration: '26:18' },
    ],
    files: [
      { id: 'f401', name: 'Sample-schema.sql', sizeLabel: '8 KB', kind: 'SQL' },
    ],
  },
  '4': {
    id: '4',
    title: 'DevOps & deployment',
    shortDescription:
      'CI/CD, containers, and cloud deployment with a practical pipeline project.',
    category: 'Operations',
    level: 'Intermediate',
    duration: '7 weeks',
    moduleCount: 10,
    currency: 'USD',
    price: 99,
    fullDescription:
      'Ship confidently: containerize an app, configure a pipeline, and monitor releases with sensible defaults for small teams.',
    outcomes: [
      'Build and run services with Docker',
      'Configure a basic CI pipeline',
      'Understand environments and secrets handling',
    ],
    videos: [
      { id: 'v401', title: 'Containers 101', duration: '22:11' },
      { id: 'v402', title: 'CI pipeline walkthrough', duration: '29:55' },
    ],
    files: [
      { id: 'f501', name: 'docker-compose.example.yml', sizeLabel: '2 KB', kind: 'YAML' },
    ],
  },
  '5': {
    id: '5',
    title: 'UI/UX for developers',
    shortDescription:
      'Layout systems, accessibility, and design handoff so your interfaces feel professional.',
    category: 'Design',
    level: 'Beginner',
    duration: '5 weeks',
    moduleCount: 8,
    currency: 'USD',
    price: 59,
    fullDescription:
      'Bridge design and code: spacing, typography, motion, and accessibility checks you can apply in any stack.',
    outcomes: [
      'Apply a consistent spacing and type scale',
      'Catch common a11y issues before release',
      'Collaborate with designers using shared terminology',
    ],
    videos: [
      { id: 'v501', title: 'Layout & spacing systems', duration: '17:33' },
    ],
    files: [
      { id: 'f601', name: 'Figma-handoff-notes.pdf', sizeLabel: '1.1 MB', kind: 'PDF' },
    ],
  },
  '6': {
    id: '6',
    title: 'Advanced system design',
    shortDescription:
      'Scalability, caching, queues, and trade-offs for large-scale tutorial platforms.',
    category: 'Architecture',
    level: 'Advanced',
    duration: '12 weeks',
    moduleCount: 16,
    currency: 'USD',
    price: 149,
    fullDescription:
      'Discuss load balancing, caching layers, async workers, and how to document trade-offs for stakeholders. Case studies from content-heavy platforms.',
    outcomes: [
      'Sketch high-level architectures for scale',
      'Choose caching and queue strategies for workloads',
      'Communicate risks and mitigations clearly',
    ],
    videos: [
      { id: 'v601', title: 'Scaling reads & writes', duration: '40:12' },
      { id: 'v602', title: 'Event-driven patterns', duration: '33:45' },
    ],
    files: [
      { id: 'f701', name: 'Architecture-templates.drawio', sizeLabel: '64 KB', kind: 'Diagram' },
    ],
  },
};

export function getCourseDetailById(id: string | undefined): CourseDetail | undefined {
  if (!id) return undefined;
  return MOCK_COURSE_DETAILS[id];
}
