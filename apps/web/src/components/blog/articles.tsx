import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { queryKeys } from "~/lib/query-keys";
import { $getAllPublicArticles } from "~/lib/server";
import SectionHeading from "../section-heading";
import ArticleCard from "./article-card";

const BlogSection = () => {
  const { data: articles } = useSuspenseQuery({
    queryKey: queryKeys.blog.listPublic(),
    queryFn: () => $getAllPublicArticles(),
  });

  return (
    <div>
      <SectionHeading>Recent Posts</SectionHeading>
      {articles?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard article={article} key={article.slug} />
          ))}
        </div>
      ) : null}

      <div className="my-8 flex items-center justify-center">
        <Link
          className={cn(
            buttonVariants({
              variant: "outline",
            }),
            "rounded-xl"
          )}
          to="/blog"
        >
          See all articles
        </Link>
      </div>
    </div>
  );
};

export default BlogSection;
