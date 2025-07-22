import { Link } from "@tanstack/react-router";
import { formatDate } from "~/lib/utils";
import { ArticleType } from "~/types";

interface ArticleCardProps {
  article: ArticleType;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <article className="group relative flex flex-col space-y-2 rounded-2xl border bg-background p-3">
      {article.imageUrl && (
        <div className="relative w-full">
          <img
            src={article.imageUrl}
            alt={article.title}
            width={1200}
            height={630}
            className="my-auto aspect-[2/1] h-auto animate-reveal rounded-xl border bg-muted object-cover transition-colors"
          />
        </div>
      )}

      <div className="mt-2 flex h-full w-full flex-col gap-2">
        <h2 className="line-clamp-2 font-extrabold text-2xl">
          {article.title}
        </h2>
        {article.description && (
          <p className="line-clamp-3 text-muted-foreground sm:line-clamp-2 md:line-clamp-4">
            {article.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-muted-foreground text-sm">
          {article.createdAt && <span>{formatDate(article.createdAt)}</span>}
        </div>
      </div>

      <Link
        to="/blog/$articleId"
        params={{
          articleId: article.slug,
        }}
        className="absolute inset-0"
      >
        <span className="sr-only">View Article</span>
      </Link>
    </article>
  );
};

export default ArticleCard;
