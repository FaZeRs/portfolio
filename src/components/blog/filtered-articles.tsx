import { SearchIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import ArticleCard from "~/components/blog/article-card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ArticleType } from "~/types";

interface FilteredArticlesProps {
  articles: ArticleType[];
}

export default function FilteredArticles({
  articles,
}: Readonly<FilteredArticlesProps>) {
  const [searchValue, setSearchValue] = useState("");

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <>
      <div className="relative my-8">
        <Input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder="Search articles"
          aria-label="Search articles"
          className="w-full pl-12"
          id="search"
        />

        <Label htmlFor="search">
          <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-4 size-5 text-muted-foreground" />
        </Label>
      </div>

      {filteredArticles.length ? (
        <div className="grid gap-10 lg:grid-cols-2">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="my-24 text-center text-lg">No articles found</div>
      )}
    </>
  );
}
