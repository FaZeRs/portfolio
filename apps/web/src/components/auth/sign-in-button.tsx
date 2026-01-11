import { Button } from "@acme/ui/button";
import { LogIn } from "lucide-react";
import { useSignInModal } from "~/hooks/use-sign-in-modal";

export default function SignInButton() {
  const { setOpen } = useSignInModal();
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <LogIn className="h-6 w-6 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">Sign in to leave a message</p>
        <p className="text-muted-foreground text-sm">
          Join the conversation and share your thoughts
        </p>
      </div>
      <Button className="mt-2" onClick={() => setOpen(true)}>
        Sign In
      </Button>
    </div>
  );
}
