import { UserType } from "@acme/types";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { useTRPC } from "~/lib/trpc";

interface MessageFormProps {
  user: UserType;
}

export default function MessageForm({ user }: Readonly<MessageFormProps>) {
  const formRef = useRef<HTMLFormElement>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    ...trpc.guestbook.create.mutationOptions(),
    onSuccess: () => {
      formRef.current?.reset();
      toast.success("Message posted");
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(trpc.guestbook.all.queryOptions());
    },
  });

  const createMessageHandler = async (formData: FormData) => {
    const raw = (formData.get("message") as string) ?? "";
    const message = raw.trim();
    if (!message) {
      toast.error("Please enter a message.");
      return;
    }
    const toastId = toast.loading("Sending your message ...");
    try {
      await mutateAsync({ message });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-4">
      <form action={createMessageHandler} ref={formRef}>
        <div className="flex items-center gap-4">
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
          <div className="relative flex-1">
            <Input
              aria-label="Your message"
              className="h-12 rounded-xl border-none bg-muted pr-24 focus-visible:ring-1"
              name="message"
              placeholder="Leave a message..."
              required
            />
            <Button
              className="absolute top-1/2 right-2 -translate-y-1/2 gap-2"
              disabled={isPending}
              size="sm"
              type="submit"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
