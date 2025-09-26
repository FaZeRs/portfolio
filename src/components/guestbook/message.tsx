import { useSuspenseQuery } from "@tanstack/react-query";
import { authQueryOptions } from "~/lib/auth/queries";
import { GuestbookType, UserType } from "~/types";
import Timestamp from "../timestamp";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import DeleteMessageButton from "./delete-message-button";

type MessageProps = {
  message: GuestbookType & { user: Pick<UserType, "id" | "name" | "image"> };
};

export default function Message({ message }: Readonly<MessageProps>) {
  const { id, message: body, user, createdAt } = message;
  const { data: currentUser } = useSuspenseQuery(authQueryOptions());

  return (
    <div className="flex gap-3 px-3 text-sm">
      <Avatar>
        <AvatarImage
          alt={user.name}
          className="size-10 rounded-full"
          height={40}
          src={user.image as string}
          width={40}
        />
        <AvatarFallback className="bg-transparent">
          <Skeleton className="size-10 rounded-full" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-1.5">
          <div>{user.name}</div>
          <Timestamp datetime={createdAt.toString()} />
        </div>
        <div className="group flex min-h-8 items-center gap-4">
          <p className="w-fit break-words rounded-xl rounded-tl-none bg-muted px-3 py-2">
            {body}
          </p>
          {(currentUser?.id === user.id || currentUser?.role === "admin") && (
            <DeleteMessageButton messageId={id} />
          )}
        </div>
      </div>
    </div>
  );
}
