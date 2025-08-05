import { ClientOnly } from "@tanstack/react-router";
import { JSONContent } from "@tiptap/react";
import { useMemo, useState } from "react";
import Timestamp from "~/components/timestamp";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { CommentContext, CommentProvider } from "~/contexts/comment";
import { CommentType, UserType } from "~/types";
import CommentActions from "./comment-actions";
import CommentEditor, { useCommentEditor } from "./comment-editor";
import CommentMenu from "./comment-menu";
import CommentReplies from "./comment-replies";
import CommentReply from "./comment-reply";

interface CommentItemProps {
  comment: CommentType & {
    user: UserType;
    likesCount: number;
    dislikesCount: number;
    repliesCount: number;
    liked: boolean;
    disliked: boolean;
  };
  articleSlug: string;
}

export default function CommentItem({
  comment,
  articleSlug,
}: Readonly<CommentItemProps>) {
  const {
    user: { name, image },
    id,
    parentId,
    content,
    createdAt,
    repliesCount,
  } = comment;

  const [editor, setEditor] = useCommentEditor();

  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpenReplies, setIsOpenReplies] = useState(false);

  const context = useMemo<CommentContext>(() => {
    return {
      isEditing,
      isReplying,
      isOpenReplies,
      setIsEditing,
      setIsReplying,
      setIsOpenReplies,
      comment,
    };
  }, [comment, isEditing, isOpenReplies, isReplying]);

  return (
    <CommentProvider value={context}>
      <div
        className="overflow-hidden"
        id={parentId ? `comment-${parentId}-${id}` : `comment-${id}`}
      >
        <div className="flex gap-2 p-2 sm:px-4">
          {image ? (
            <Avatar className="size-8">
              <AvatarImage src={image} />
              <AvatarFallback className="bg-transparent">
                <Skeleton className="size-8 rounded-full" />
              </AvatarFallback>
            </Avatar>
          ) : null}

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <div className="font-semibold">{name}</div>

                <Timestamp datetime={createdAt.toString()} />
              </div>

              <CommentMenu comment={comment} slug={articleSlug} />
            </div>

            <ClientOnly>
              <CommentEditor
                editor={editor}
                onChange={setEditor}
                content={content as JSONContent}
                editable={false}
              />
            </ClientOnly>

            {isReplying ? <CommentReply /> : <CommentActions />}

            {!parentId && repliesCount > 0 ? (
              <CommentReplies articleSlug={articleSlug} />
            ) : null}
          </div>
        </div>
      </div>
    </CommentProvider>
  );
}
