import { siteConfig } from "./config/site";
import { getBaseUrl } from "./utils";

export function seo({
  title,
  description,
  keywords,
  image = `${getBaseUrl()}/images/cover.avif`,
  author,
  type = "website",
}: {
  title: string;
  description?: string | null;
  image?: string | null;
  keywords?: string | null;
  author?: string | null;
  type?: "website" | "article" | "video" | "book" | "profile";
}) {
  const tags = [
    { title },
    ...(description ? [{ name: "description", content: description }] : []),
    ...(keywords ? [{ name: "keywords", content: keywords }] : []),
    { name: "author", content: author ?? siteConfig.author.name },
    { name: "twitter:title", content: title },
    ...(description
      ? [{ name: "twitter:description", content: description }]
      : []),
    { name: "twitter:creator", content: siteConfig.author.handle },
    { name: "twitter:site", content: siteConfig.author.handle },
    { name: "twitter:widgets:new-embed-design", content: "on" },
    { name: "og:type", content: type },
    { name: "og:site_name", content: siteConfig.title },
    { name: "og:title", content: title },
    ...(description ? [{ name: "og:description", content: description }] : []),
    { name: "og:locale", content: "en_US" },
    ...(image
      ? [
          { name: "twitter:image::src", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "og:image", content: image },
        ]
      : []),
  ];

  return tags;
}
