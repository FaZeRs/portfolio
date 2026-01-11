import { ArticleType } from "@acme/types";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { motion } from "framer-motion";
import { FileText, Search } from "lucide-react";
import { ChangeEvent, useState } from "react";
import ArticleCard from "~/components/blog/article-card";

type FilteredArticlesProps = {
  articles: (ArticleType & { viewCount: number })[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function FilteredArticles({
  articles,
}: Readonly<FilteredArticlesProps>) {
  const [searchValue, setSearchValue] = useState("");

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <>
      {/* Search box */}
      <div className="relative mb-8">
        <Input
          aria-label="Search articles"
          className="h-12 rounded-xl border-none bg-muted pl-12 focus-visible:ring-1"
          id="search"
          onChange={handleInputChange}
          placeholder="Search articles..."
          type="text"
          value={searchValue}
        />
        <Label htmlFor="search">
          <Search className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-muted-foreground" />
        </Label>
      </div>

      {filteredArticles.length ? (
        <motion.div
          animate="visible"
          className="grid gap-6 sm:grid-cols-2"
          initial="hidden"
          variants={containerVariants}
        >
          {filteredArticles.map((article) => (
            <motion.div key={article.slug} variants={itemVariants}>
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-lg">No articles found</p>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        </div>
      )}
    </>
  );
}
