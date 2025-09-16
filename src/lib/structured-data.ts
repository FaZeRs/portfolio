import { siteConfig, socialConfig } from "./config/site";
import { getBaseUrl } from "./utils";

export type Person = {
  "@type": "Person";
  name: string;
  url: string;
  sameAs: string[];
  image?: string;
  jobTitle?: string;
  worksFor?: Organization;
};

export type Organization = {
  "@type": "Organization";
  name: string;
  url: string;
};

export type Article = {
  "@type": "Article";
  headline: string;
  description: string;
  image: string;
  author: Person;
  publisher: Organization;
  datePublished: string;
  dateModified: string;
  url: string;
  keywords?: string;
};

export type WebSite = {
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  author: Person;
  inLanguage: "en-US";
  copyrightYear: number;
  copyrightHolder: Person;
};

export type WebPage = {
  "@type": "WebPage";
  name: string;
  url: string;
  description: string;
  isPartOf: WebSite;
  inLanguage: "en-US";
};

export function createPersonSchema(): Person {
  return {
    "@type": "Person",
    name: siteConfig.author.name,
    url: getBaseUrl(),
    sameAs: socialConfig.map((social) => social.url),
    jobTitle: "Full Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
      url: getBaseUrl(),
    },
  };
}

export function createWebSiteSchema(): WebSite {
  return {
    "@type": "WebSite",
    name: siteConfig.title,
    url: getBaseUrl(),
    description: siteConfig.description,
    author: createPersonSchema(),
    inLanguage: "en-US",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: createPersonSchema(),
  };
}

export function createWebPageSchema(
  title: string,
  description: string,
  url: string
): WebPage {
  return {
    "@type": "WebPage",
    name: title,
    url: `${getBaseUrl()}${url}`,
    description,
    isPartOf: createWebSiteSchema(),
    inLanguage: "en-US",
  };
}

export function createArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  url,
  keywords,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  url: string;
  keywords?: string;
}): Article {
  return {
    "@type": "Article",
    headline: title,
    description,
    image,
    author: createPersonSchema(),
    publisher: {
      "@type": "Organization",
      name: siteConfig.title,
      url: getBaseUrl(),
    },
    datePublished,
    dateModified,
    url: `${getBaseUrl()}${url}`,
    keywords,
  };
}

export function generateStructuredData(
  schema: Record<string, unknown>
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    ...schema,
  });
}
