import type { CourseSummary } from '../courses/types';

export type CourseVideoItem = {
  id: string;
  title: string;
  duration: string;
};

export type CourseFileItem = {
  id: string;
  name: string;
  sizeLabel: string;
  kind: string;
};

export type CourseDetail = CourseSummary & {
  fullDescription: string;
  price: string;
  currency: string;
  outcomes: string[];
  videos: CourseVideoItem[];
  files: CourseFileItem[];
};
