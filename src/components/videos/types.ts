/** Catalog entry for the learner videos library (admin-managed YouTube links) */
export type VideoCatalogItem = {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  duration: string;
  /** YouTube video ID only — embed uses https://www.youtube.com/embed/{youtubeId} */
  youtubeId: string;
};
