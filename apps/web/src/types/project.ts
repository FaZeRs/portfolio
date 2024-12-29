export interface Stack {
  name: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  slug: string;
  imageUrl: string;
  isFeature: boolean;
  githubUrl: string;
  demoUrl: string;
  stack: Stack[];
}
