import { ArticleType, CommentType } from "@acme/types";
import { calculateReadingTime, formatDate } from "@acme/utils";
import { EyeIcon, MessageSquare, ThumbsUpIcon, TimerIcon } from "lucide-react";

type ArticleMetricsProps = {
  article: ArticleType & { comments: CommentType[]; viewCount: number };
};

const ArticleMetrics = ({ article }: ArticleMetricsProps) => {
  const readingTime = calculateReadingTime(article.content ?? "");

  return (
    <div className="mt-4 flex flex-col gap-2 text-muted-foreground text-sm sm:flex-row sm:items-center sm:justify-between sm:text-md">
      {article.createdAt && (
        <time dateTime={article.createdAt.toISOString()}>
          {formatDate(article.createdAt)}
        </time>
      )}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1">
          <TimerIcon className="size-4" />
          <span>{readingTime} min read</span>
        </div>
        <div className="flex items-center gap-1">
          <EyeIcon className="size-4" />
          <span>{article.viewCount} views</span>
        </div>

        <div className="flex items-center gap-1">
          <ThumbsUpIcon className="size-4" />
          <span>{article.likes} likes</span>
        </div>

        {article.comments && (
          <div className="flex items-center gap-1">
            <MessageSquare className="size-4" />
            <span>{article.comments.length} comments</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleMetrics;
