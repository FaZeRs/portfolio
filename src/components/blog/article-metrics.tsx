import { TimerIcon } from "lucide-react";
import { calculateReadingTime } from "~/lib/utils";
import { ArticleType } from "~/types";

interface ArticleMetricsProps {
  article: ArticleType;
}

const ArticleMetrics = ({ article }: ArticleMetricsProps) => {
  const readingTime = calculateReadingTime(article.content ?? "");

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <TimerIcon className="size-4" />
        <span>{readingTime} min read</span>
      </div>
    </div>
  );
};

export default ArticleMetrics;
