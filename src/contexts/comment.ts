import { createContext, useContext } from "react";
import { CommentType } from "~/types";

export type CommentContext = {
  isEditing: boolean;
  isReplying: boolean;
  isOpenReplies: boolean;
  setIsEditing: (value: boolean) => void;
  setIsReplying: (value: boolean) => void;
  setIsOpenReplies: (value: boolean) => void;
  comment: CommentType & {
    likesCount: number;
    dislikesCount: number;
    repliesCount: number;
    liked: boolean;
    disliked: boolean;
  };
};

const CommentContext = createContext<CommentContext | undefined>(undefined);

export const useCommentContext = () => {
  const context = useContext(CommentContext);

  if (!context) {
    throw new Error("useCommentContext must be used within a CommentProvider");
  }

  return context;
};

export const CommentProvider = CommentContext.Provider;
