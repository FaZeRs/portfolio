import { CommentReactionType, CommentType, UserType } from "@acme/types";
import { createContext, useContext } from "react";

export interface CommentContext {
  comment: {
    comment: CommentType;
    user: UserType | null;
    likesCount: number;
    dislikesCount: number;
    repliesCount: number;
    userReaction: CommentReactionType | null;
  };
  isEditing: boolean;
  isOpenReplies: boolean;
  isReplying: boolean;
  setIsEditing: (value: boolean) => void;
  setIsOpenReplies: (value: boolean) => void;
  setIsReplying: (value: boolean) => void;
}

const CommentContext = createContext<CommentContext | undefined>(undefined);

export const useCommentContext = () => {
  const context = useContext(CommentContext);

  if (!context) {
    throw new Error("useCommentContext must be used within a CommentProvider");
  }

  return context;
};

export const CommentProvider = CommentContext.Provider;
