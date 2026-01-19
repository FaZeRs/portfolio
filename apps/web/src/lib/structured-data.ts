import { siteConfig, socialConfig } from "@acme/config";
import { getBaseUrl } from "./utils";

type SchemaObject = Record<string, unknown>;

type WithId = {
  "@id"?: string;
};

type Person = WithId & {
  "@type": "Person";
  name: string;
  url: string;
  sameAs: string[];
  image?: string;
  jobTitle?: string;
  worksFor?: Organization;
  email?: string;
  knowsAbout?: string[];
};

type Organization = WithId & {
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
};

type BlogPosting = WithId & {
  "@type": "BlogPosting";
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
  headline: string;
  description: string;
  image: string;
  author: Person | { "@id": string };
  publisher: Organization | { "@id": string };
  datePublished: string;
  dateModified: string;
  url: string;
  keywords?: string;
  wordCount?: number;
  articleSection?: string;
  inLanguage?: string;
};

type WebSite = WithId & {
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  author: Person | { "@id": string };
  publisher: Organization | { "@id": string };
  inLanguage: string;
  copyrightYear: number;
  copyrightHolder: Person | { "@id": string };
  potentialAction?: SearchAction;
};

type SearchAction = {
  "@type": "SearchAction";
  target: {
    "@type": "EntryPoint";
    urlTemplate: string;
  };
  "query-input": string;
};

type ProfilePage = WithId & {
  "@type": "ProfilePage";
  name: string;
  url: string;
  description: string;
  mainEntity: Person | { "@id": string };
  isPartOf: { "@id": string };
  inLanguage: string;
};

type CollectionPage = WithId & {
  "@type": "CollectionPage";
  name: string;
  url: string;
  description: string;
  isPartOf: { "@id": string };
  inLanguage: string;
};

type BreadcrumbList = WithId & {
  "@type": "BreadcrumbList";
  itemListElement: BreadcrumbItem[];
};

type BreadcrumbItem = {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
};

type SoftwareSourceCode = WithId & {
  "@type": "SoftwareSourceCode";
  name: string;
  description: string;
  url: string;
  image?: string;
  author: Person | { "@id": string };
  dateCreated?: string;
  dateModified?: string;
  programmingLanguage?: string[];
  codeRepository?: string;
  runtimePlatform?: string;
  applicationCategory?: string;
};

const schemaIds = {
  person: () => `${getBaseUrl()}/#person`,
  organization: () => `${getBaseUrl()}/#organization`,
  website: () => `${getBaseUrl()}/#website`,
  webpage: (path: string) => `${getBaseUrl()}${path}#webpage`,
} as const;

function normalizeImageUrl(image: string | undefined): string | undefined {
  if (!image) {
    return;
  }
  if (image.startsWith("http")) {
    return image;
  }
  return `${getBaseUrl()}${image}`;
}

function createPersonSchema(options?: { includeId?: boolean }): Person {
  const schema: Person = {
    "@type": "Person",
    name: siteConfig.author.name,
    url: getBaseUrl(),
    sameAs: socialConfig.map((social) => social.url),
    image: `${getBaseUrl()}/images/avatar.avif`,
    jobTitle: "R&D Engineer",
    email: siteConfig.author.email,
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
      url: getBaseUrl(),
    },
    knowsAbout: [
      "TypeScript",
      "React",
      "Node.js",
      "C++",
      "Qt Framework",
      "WebAssembly",
      "Full Stack Development",
    ],
  };

  if (options?.includeId) {
    schema["@id"] = schemaIds.person();
  }

  return schema;
}

function createOrganizationSchema(options?: {
  includeId?: boolean;
}): Organization {
  const schema: Organization = {
    "@type": "Organization",
    name: siteConfig.title,
    url: getBaseUrl(),
    logo: `${getBaseUrl()}/images/icon.svg`,
  };

  if (options?.includeId) {
    schema["@id"] = schemaIds.organization();
  }

  return schema;
}

function createWebSiteSchema(options?: {
  includeId?: boolean;
  useRefs?: boolean;
}): WebSite {
  const schema: WebSite = {
    "@type": "WebSite",
    name: siteConfig.title,
    url: getBaseUrl(),
    description: siteConfig.description,
    author: options?.useRefs
      ? { "@id": schemaIds.person() }
      : createPersonSchema(),
    publisher: options?.useRefs
      ? { "@id": schemaIds.organization() }
      : createOrganizationSchema(),
    inLanguage: "en-US",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: options?.useRefs
      ? { "@id": schemaIds.person() }
      : createPersonSchema(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${getBaseUrl()}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  if (options?.includeId) {
    schema["@id"] = schemaIds.website();
  }

  return schema;
}

function createProfilePageSchema(
  title: string,
  description: string,
  path: string
): ProfilePage {
  return {
    "@type": "ProfilePage",
    "@id": `${getBaseUrl()}${path}#profilepage`,
    name: title,
    url: `${getBaseUrl()}${path}`,
    description,
    mainEntity: { "@id": schemaIds.person() },
    isPartOf: { "@id": schemaIds.website() },
    inLanguage: "en-US",
  };
}

function createCollectionPageSchema(
  title: string,
  description: string,
  path: string
): CollectionPage {
  return {
    "@type": "CollectionPage",
    "@id": `${getBaseUrl()}${path}#collectionpage`,
    name: title,
    url: `${getBaseUrl()}${path}`,
    description,
    isPartOf: { "@id": schemaIds.website() },
    inLanguage: "en-US",
  };
}

function createBreadcrumbSchema(
  items: { name: string; path: string }[]
): BreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${getBaseUrl()}${item.path}`,
    })),
  };
}

function createBlogPostingSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  path,
  keywords,
  wordCount,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  path: string;
  keywords?: string;
  wordCount?: number;
}): BlogPosting {
  const url = `${getBaseUrl()}${path}`;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#blogposting`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: title,
    description,
    image: image.startsWith("http") ? image : `${getBaseUrl()}${image}`,
    author: { "@id": schemaIds.person() },
    publisher: { "@id": schemaIds.organization() },
    datePublished,
    dateModified,
    url,
    keywords,
    wordCount,
    inLanguage: "en-US",
  };
}

function createSoftwareProjectSchema({
  title,
  description,
  path,
  image,
  githubUrl,
  stacks,
  dateCreated,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  githubUrl?: string;
  stacks?: string[];
  dateCreated?: string;
  dateModified?: string;
}): SoftwareSourceCode {
  const url = `${getBaseUrl()}${path}`;
  return {
    "@type": "SoftwareSourceCode",
    "@id": `${url}#software`,
    name: title,
    description,
    url,
    image: normalizeImageUrl(image),
    author: { "@id": schemaIds.person() },
    codeRepository: githubUrl,
    programmingLanguage: stacks,
    dateCreated,
    dateModified,
    applicationCategory: "DeveloperApplication",
  };
}

export function generateStructuredDataGraph(schemas: SchemaObject[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": schemas,
  });
}

export function getHomepageSchemas(): SchemaObject[] {
  return [
    createPersonSchema({ includeId: true }) as SchemaObject,
    createOrganizationSchema({ includeId: true }) as SchemaObject,
    createWebSiteSchema({ includeId: true, useRefs: true }) as SchemaObject,
  ];
}

export function getAboutPageSchemas(): SchemaObject[] {
  return [
    createPersonSchema({ includeId: true }) as SchemaObject,
    createOrganizationSchema({ includeId: true }) as SchemaObject,
    createWebSiteSchema({ includeId: true, useRefs: true }) as SchemaObject,
    createProfilePageSchema(
      `About | ${siteConfig.title}`,
      "About me and my journey as a software engineer.",
      "/about"
    ) as SchemaObject,
    createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]) as SchemaObject,
  ];
}

export function getBlogListSchemas(): SchemaObject[] {
  return [
    createPersonSchema({ includeId: true }) as SchemaObject,
    createOrganizationSchema({ includeId: true }) as SchemaObject,
    createWebSiteSchema({ includeId: true, useRefs: true }) as SchemaObject,
    createCollectionPageSchema(
      `Blog | ${siteConfig.title}`,
      "Thoughts, tutorials, and insights about web development.",
      "/blog"
    ) as SchemaObject,
    createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]) as SchemaObject,
  ];
}

export function getBlogPostSchemas(post: {
  title: string;
  description: string;
  image: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  keywords?: string;
  wordCount?: number;
}): SchemaObject[] {
  const path = `/blog/${post.slug}`;
  return [
    createPersonSchema({ includeId: true }) as SchemaObject,
    createOrganizationSchema({ includeId: true }) as SchemaObject,
    createWebSiteSchema({ includeId: true, useRefs: true }) as SchemaObject,
    createBlogPostingSchema({
      title: post.title,
      description: post.description,
      image: post.image,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      path,
      keywords: post.keywords,
      wordCount: post.wordCount,
    }) as SchemaObject,
    createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path },
    ]) as SchemaObject,
  ];
}

export function getProjectListSchemas(): SchemaObject[] {
  return [
    createPersonSchema({ includeId: true }) as SchemaObject,
    createOrganizationSchema({ includeId: true }) as SchemaObject,
    createWebSiteSchema({ includeId: true, useRefs: true }) as SchemaObject,
    createCollectionPageSchema(
      `Projects | ${siteConfig.title}`,
      "Several projects that I have worked on, both private and open source.",
      "/projects"
    ) as SchemaObject,
    createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
    ]) as SchemaObject,
  ];
}

export function getProjectSchemas(project: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  githubUrl?: string;
  stacks?: string[];
  dateCreated?: string;
  dateModified?: string;
}): SchemaObject[] {
  const path = `/projects/${project.slug}`;
  return [
    createPersonSchema({ includeId: true }) as SchemaObject,
    createOrganizationSchema({ includeId: true }) as SchemaObject,
    createWebSiteSchema({ includeId: true, useRefs: true }) as SchemaObject,
    createSoftwareProjectSchema({
      title: project.title,
      description: project.description,
      path,
      image: project.image,
      githubUrl: project.githubUrl,
      stacks: project.stacks,
      dateCreated: project.dateCreated,
      dateModified: project.dateModified,
    }) as SchemaObject,
    createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
      { name: project.title, path },
    ]) as SchemaObject,
  ];
}
