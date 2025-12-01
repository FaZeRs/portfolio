import { ArticleType, UserType } from "@acme/types";
import Icon from "@acme/ui/icon";
import { LazyImage } from "@acme/ui/lazy-image";
import { siX } from "simple-icons";

type ArticleAuthorProps = {
  article: ArticleType & { author: UserType };
};

const ArticleAuthor = ({ article }: ArticleAuthorProps) => {
  if (!article.author) {
    return null;
  }

  const hasTwitterHandle =
    article.author.twitterHandle && article.author.twitterHandle.trim() !== "";

  return (
    <div className="mt-4 flex items-center gap-3 sm:gap-4">
      {article.author.image && (
        <LazyImage
          alt={article.author.name}
          className="h-10 w-10"
          height={40}
          imageClassName="rounded-full bg-white"
          priority={true}
          sizes="40px"
          src={article.author.image}
          width={40}
        />
      )}
      <div className="flex-1 text-left leading-tight">
        <p className="font-medium text-sm sm:text-base">
          {article.author.name}
        </p>
        {hasTwitterHandle && (
          <a
            className="inline-flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            href={`https://twitter.com/${article.author.twitterHandle}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Icon className="h-3 w-3" icon={siX} />@
            {article.author.twitterHandle}
          </a>
        )}
      </div>
    </div>
  );
};

export default ArticleAuthor;
