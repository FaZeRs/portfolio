import SocialSignInButton from "~/components/auth/social-sign-in-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useSignInModal } from "~/hooks/use-sign-in-modal";

export default function SignInModal() {
  const { open, setOpen } = useSignInModal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left text-2xl">Sign in</DialogTitle>
          <DialogDescription className="text-left">
            to continue to naurislinde.dev
          </DialogDescription>
        </DialogHeader>

        <SocialSignInButton />
      </DialogContent>
    </Dialog>
  );
}
