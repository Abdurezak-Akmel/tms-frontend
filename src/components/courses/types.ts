export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type CourseSummary = {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  level: CourseLevel;
  duration: string;
  moduleCount: number;
  locked?: boolean;
};
