import CommentForm from "./comment/comment-form";
import CommentList from "./comment/comment-list";

type ArticleCommentProps = {
  articleId: string;
  articleSlug: string;
};

export default function ArticleComment({
  articleId,
  articleSlug,
}: Readonly<ArticleCommentProps>) {
  return (
    <div className="space-y-6">
      <CommentForm articleId={articleId} />
      <CommentList articleId={articleId} articleSlug={articleSlug} />
    </div>
  );
}
