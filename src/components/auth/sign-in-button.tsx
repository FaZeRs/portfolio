import { Button } from "~/components/ui/button";
import { useSignInModal } from "~/hooks/use-sign-in-modal";

export default function SignInButton() {
  const { setOpen } = useSignInModal();
  return (
    <>
      Please{" "}
      <Button
        className="px-0 text-base underline"
        onClick={() => setOpen(true)}
        variant="link"
      >
        login
      </Button>
      <span className="ml-2">to continue leaving a message</span>
    </>
  );
}
