import { siteConfig } from "./config/site";

export function seo({
  title,
  description,
  keywords,
  image,
}: {
  title: string;
  description?: string | null;
  image?: string | null;
  keywords?: string | null;
}) {
  const tags = [
    { title },
    ...(description ? [{ name: "description", content: description }] : []),
    ...(keywords ? [{ name: "keywords", content: keywords }] : []),
    { name: "author", content: siteConfig.author.name },
    { name: "twitter:title", content: title },
    ...(description
      ? [{ name: "twitter:description", content: description }]
      : []),
    { name: "twitter:creator", content: siteConfig.author.handle },
    { name: "twitter:site", content: siteConfig.author.handle },
    { name: "og:type", content: "website" },
    { name: "og:site_name", content: siteConfig.title },
    { name: "og:title", content: title },
    ...(description ? [{ name: "og:description", content: description }] : []),
    { name: "og:locale", content: "en_US" },
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "og:image", content: image },
        ]
      : []),
  ];

  return tags;
}
