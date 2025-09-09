import { Link } from "@tanstack/react-router";
import { EyeIcon, ThumbsUpIcon } from "lucide-react";
import { LazyImage } from "~/components/lazy-image";
import { formatDate } from "~/lib/utils";
import { ArticleType } from "~/types";

type ArticleCardProps = {
  article: ArticleType;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <article className="group relative flex flex-col space-y-2 rounded-2xl border bg-background p-3">
      {article.imageUrl && (
        <LazyImage
          alt={article.title}
          className="rounded-xl border bg-muted transition-colors"
          height={250}
          imageClassName="aspect-[2/1] object-cover rounded-xl"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={article.imageUrl}
          width={500}
        />
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

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <EyeIcon className="size-4" />
              <span>{article.views} views</span>
            </div>

            <div className="flex items-center gap-1">
              <ThumbsUpIcon className="size-4" />
              <span>{article.likes} likes</span>
            </div>
          </div>
        </div>
      </div>

      <Link
        className="absolute inset-0"
        params={{
          articleId: article.slug,
        }}
        to="/blog/$articleId"
      >
        <span className="sr-only">View Article</span>
      </Link>
    </article>
  );
};

export default ArticleCard;
