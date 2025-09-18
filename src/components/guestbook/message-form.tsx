import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SendHorizontal } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { useTRPC } from "~/trpc/react";
import { UserType } from "~/types";

type MessageFormProps = {
  user: UserType;
};

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
      // biome-ignore lint/suspicious/noConsole: logging error
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
    <div className="space-y-4">
      <form action={createMessageHandler} ref={formRef}>
        <div className="mb-2 flex items-center gap-3">
          <Avatar>
            <AvatarImage
              alt={user.name}
              className="size-10"
              height={40}
              src={user.image as string}
              width={40}
            />
            <AvatarFallback className="bg-transparent">
              <Skeleton className="size-10 rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div className="relative w-full">
            <Input
              aria-label="Your message"
              className="h-12 pr-20"
              name="message"
              placeholder="Your message ..."
              required
            />
            <Button
              className="-translate-y-1/2 absolute top-1/2 right-2 gap-1"
              disabled={isPending}
              size="sm"
              type="submit"
            >
              Send
              <SendHorizontal
                aria-hidden="true"
                aria-label="Send"
                className="size-4"
              />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
