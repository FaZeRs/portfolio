import { EyeIcon, MessageSquare, ThumbsUpIcon, TimerIcon } from "lucide-react";
import { calculateReadingTime } from "~/lib/utils";
import { ArticleType, CommentType } from "~/types";

interface ArticleMetricsProps {
  article: ArticleType & { comments: CommentType[] };
}

const ArticleMetrics = ({ article }: ArticleMetricsProps) => {
  const readingTime = calculateReadingTime(article.content ?? "");

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <TimerIcon className="size-4" />
        <span>{readingTime} min read</span>
      </div>
      <div className="flex items-center gap-1">
        <EyeIcon className="size-4" />
        <span>{article.views} views</span>
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
  );
};

export default ArticleMetrics;
