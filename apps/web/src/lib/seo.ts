import { siteConfig } from "@acme/config";
import { getBaseUrl } from "./utils";

export function seo({
  title,
  description,
  keywords,
  image = `${getBaseUrl()}/images/cover.avif`,
  author,
  type = "website",
  url = getBaseUrl(),
  canonical,
}: {
  title: string;
  description?: string | null;
  image?: string | null;
  keywords?: string | null;
  author?: string | null;
  type?: "website" | "article" | "video" | "book" | "profile";
  url?: string;
  canonical?: string;
}) {
  const tags = [
    { title },
    ...(description ? [{ name: "description", content: description }] : []),
    ...(keywords ? [{ name: "keywords", content: keywords }] : []),
    { name: "author", content: author ?? siteConfig.author.name },
    { name: "robots", content: "index, follow" },
    { name: "twitter:title", content: title },
    ...(description
      ? [{ name: "twitter:description", content: description }]
      : []),
    { name: "twitter:creator", content: siteConfig.author.handle },
    { name: "twitter:site", content: siteConfig.author.handle },
    { name: "twitter:widgets:new-embed-design", content: "on" },
    { name: "twitter:url", content: url },
    { name: "og:type", content: type },
    { name: "og:site_name", content: siteConfig.title },
    { name: "og:title", content: title },
    ...(description ? [{ name: "og:description", content: description }] : []),
    { name: "og:locale", content: "en_US" },
    { name: "og:url", content: url },
    ...(image
      ? [
          { name: "twitter:image", content: image },
          {
            name: "twitter:image:alt",
            content: `${title} - ${siteConfig.title}`,
          },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "og:image", content: image },
          { name: "og:image:alt", content: `${title} - ${siteConfig.title}` },
          { name: "og:image:width", content: "1200" },
          { name: "og:image:height", content: "630" },
        ]
      : []),
  ];

  const links = [...(canonical ? [{ rel: "canonical", href: canonical }] : [])];

  return { meta: tags, links };
}
