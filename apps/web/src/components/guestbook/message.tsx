import { GuestbookType, UserType } from "@acme/types";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { useSuspenseQuery } from "@tanstack/react-query";
import { authQueryOptions } from "~/lib/auth/queries";
import Timestamp from "../timestamp";
import DeleteMessageButton from "./delete-message-button";

interface MessageProps {
  message: GuestbookType & { user: Pick<UserType, "id" | "name" | "image"> };
}

export default function Message({ message }: Readonly<MessageProps>) {
  const { id, message: body, user, createdAt } = message;
  const { data: currentUser } = useSuspenseQuery(authQueryOptions());

  return (
    <div className="group flex gap-4 rounded-xl p-4 transition-colors hover:bg-muted/50">
      <Avatar className="h-10 w-10 border">
        <AvatarImage
          alt={user.name}
          className="object-cover"
          height={40}
          src={user.image as string}
          width={40}
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          {user.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{user.name}</span>
          <Timestamp datetime={createdAt.toString()} />
        </div>
        <div className="flex items-start gap-3">
          <p className="text-muted-foreground leading-relaxed">{body}</p>
          {(currentUser?.id === user.id || currentUser?.role === "admin") && (
            <DeleteMessageButton messageId={id} />
          )}
        </div>
      </div>
    </div>
  );
}
