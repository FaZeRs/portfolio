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
            "group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-sm transition-all duration-300 ease-out",
            "hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "active:scale-95 disabled:pointer-events-none disabled:opacity-50",
            isLiked
              ? "border-rose-300/50 bg-rose-50/80 text-rose-500 shadow-md hover:border-rose-400 hover:bg-rose-100 hover:shadow-lg dark:border-rose-700/50 dark:bg-rose-950/50 dark:text-rose-400 dark:hover:border-rose-600 dark:hover:bg-rose-900/60"
              : "border-border/50 bg-card/50 text-muted-foreground shadow-sm hover:border-foreground/20 hover:bg-card hover:text-foreground hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10",
            isLoading && "animate-pulse"
          )}
          disabled={isLoading}
          onClick={handleClick}
          type="button"
        >
          <HeartIcon
            className={cn(
              "h-4 w-4 transition-all duration-300 ease-out",
              "group-hover:scale-125 group-active:scale-95",
              isLiked && "fill-current"
            )}
          />
          {isLiked && (
            <div className="absolute inset-0 rounded-xl bg-rose-500/10 opacity-0 transition-opacity duration-200" />
          )}
        </button>
      </div>
    </div>
  );
};

export default LikeButton;
