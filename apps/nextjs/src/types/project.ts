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
  slug: string;
  imageUrl: string;
  isFeature: boolean;
  projectStack: ProjectStack[];
}
