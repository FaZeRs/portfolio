import { ArticleType } from "@acme/types";
import { cn } from "@acme/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";
import { useTRPC } from "~/lib/trpc";

type LikeButtonProps = {
  article: ArticleType;
};

const LikeButton = ({ article }: LikeButtonProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: isLiked = false, isLoading: isCheckingLikeStatus } = useQuery({
    ...trpc.blog.isLiked.queryOptions({ slug: article.slug }),
  });

  const likeMutation = useMutation({
    ...trpc.blog.like.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.blog.pathFilter());
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleClick = () => {
    likeMutation.mutate({ slug: article.slug });
  };

  const isLoading = likeMutation.isPending || isCheckingLikeStatus;

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <button
          aria-label={isLiked ? "Unlike this article" : "Like this article"}
          aria-pressed={isLiked}
          className={cn(
            "group relative inline-flex h-9 w-9 items-center justify-center rounded-md border transition-all duration-200 ease-out",
            "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "active:scale-95 disabled:pointer-events-none disabled:opacity-50",
            isLiked
              ? "border-rose-200 bg-rose-50 text-rose-600 shadow-sm hover:border-rose-300 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-400 dark:hover:border-rose-700 dark:hover:bg-rose-900/50"
              : "border-border bg-background text-muted-foreground shadow-sm hover:border-border/80 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            isLoading && "animate-pulse"
          )}
          disabled={isLoading}
          onClick={handleClick}
          type="button"
        >
          <HeartIcon
            className={cn(
              "h-4 w-4 transition-all duration-200 ease-out",
              "group-hover:scale-110 group-active:scale-95",
              isLiked && "fill-current"
            )}
          />
          {isLiked && (
            <div className="absolute inset-0 rounded-md bg-rose-500/10 opacity-0 transition-opacity duration-200" />
          )}
        </button>
      </div>
    </div>
  );
};

export default LikeButton;
