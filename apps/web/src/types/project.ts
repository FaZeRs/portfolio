export interface Stack {
  id: number;
  name: string;
}

export interface ProjectStack {
  id: number;
  stack: Stack;
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
  projectStack: ProjectStack[];
}
