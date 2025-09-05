import { Link } from "@tanstack/react-router";
import { CalendarIcon, EyeIcon, ThumbsUpIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ToolArticle } from "~/lib/ai";
import { formatDate } from "~/lib/utils";

const MAX_TAGS_DISPLAY = 2;

export function ArticleCard({ article }: { article: ToolArticle }) {
  const { title, description, tags, likes, views, createdAt, slug } = article;

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <Link
        className="block transition-opacity hover:opacity-80"
        params={{ articleId: slug }}
        to="/blog/$articleId"
      >
        <CardHeader className="pt-3 pb-2">
          <CardTitle className="font-extrabold text-base text-neutral-900 dark:text-neutral-200">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="line-clamp-2 text-xs">
              {description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0 pb-3">
          {tags && tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {tags.slice(0, MAX_TAGS_DISPLAY).map((tag) => (
                <Badge className="text-[10px]" key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {tags.length > MAX_TAGS_DISPLAY && (
                <Badge className="text-[10px]" variant="outline">
                  +{tags.length - MAX_TAGS_DISPLAY}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 text-muted-foreground text-xs">
            {createdAt && (
              <div className="flex items-center gap-1">
                <CalendarIcon size={12} />
                <span>{formatDate(createdAt)}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <EyeIcon size={12} />
                <span>{views}</span>
              </div>

              <div className="flex items-center gap-1">
                <ThumbsUpIcon size={12} />
                <span>{likes}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
