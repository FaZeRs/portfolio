import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { ArticleType } from "~/types";

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
      // biome-ignore lint/suspicious/noConsole: logging error
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
          className={cn(
            "group block transform overflow-hidden rounded-lg p-1 shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:rounded-[10px] focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/70 active:scale-100 active:rounded-lg",
            isLiked
              ? "bg-gradient-to-tl from-rose-500/80 to-rose-400/60 dark:from-rose-500/60 dark:to-rose-400/40"
              : "bg-gradient-to-tl from-black/80 to-black/10 dark:from-white/5 dark:to-white/30",
            isLoading && "animate-pulse"
          )}
          disabled={isLoading}
          onClick={handleClick}
          type="button"
        >
          <HeartIcon
            className={cn(
              "relative w-5 transform transition delay-100 duration-500 ease-out group-hover:scale-110",
              isLiked
                ? "fill-white text-white"
                : "text-rose-100 dark:text-rose-200"
            )}
          />
        </button>
      </div>
    </div>
  );
};

export default LikeButton;
