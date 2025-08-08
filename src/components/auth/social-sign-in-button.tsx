import { useLocation } from "@tanstack/react-router";
import { siGithub } from "simple-icons";
import { Button } from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import authClient from "~/lib/auth-client";

export default function SocialSignInButton() {
  const location = useLocation();
  const handleClick = (provider: "github") => {
    authClient.signIn.social({
      provider,
      callbackURL: location.pathname,
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        size="lg"
        className="flex w-full gap-2"
        variant="outline"
        onClick={() => handleClick("github")}
      >
        <Icon icon={siGithub} className="size-5" />
        Continue with Github
      </Button>
    </div>
  );
}
