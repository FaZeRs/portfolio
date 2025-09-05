import { ToolArticle } from "~/lib/ai";
import { ArticleCard } from "./article-card";

export function ArticleList({ articles }: { articles: ToolArticle[] }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {articles.map((article) => (
        <ArticleCard article={article} key={article.id} />
      ))}
    </div>
  );
}
