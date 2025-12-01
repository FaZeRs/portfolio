import { Button } from "@acme/ui/button";
import Icon from "@acme/ui/icon";
import { useLocation } from "@tanstack/react-router";
import { siFacebook, siGithub, siGoogle, siX } from "simple-icons";
import authClient from "~/lib/auth/client";

export default function SocialSignInButton() {
  const location = useLocation();
  const handleClick = (
    provider: "github" | "twitter" | "google" | "facebook"
  ) => {
    authClient.signIn.social({
      provider,
      callbackURL: location.pathname,
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        className="flex w-full gap-2"
        onClick={() => handleClick("github")}
        size="lg"
        variant="outline"
      >
        <Icon className="size-5" icon={siGithub} />
        Continue with Github
      </Button>
      <Button
        className="flex w-full gap-2"
        onClick={() => handleClick("twitter")}
        size="lg"
        variant="outline"
      >
        <Icon className="size-5" icon={siX} />
        Continue with Twitter (X)
      </Button>
      <Button
        className="flex w-full gap-2"
        onClick={() => handleClick("google")}
        size="lg"
        variant="outline"
      >
        <Icon className="size-5" icon={siGoogle} />
        Continue with Google
      </Button>
      <Button
        className="flex w-full gap-2"
        onClick={() => handleClick("facebook")}
        size="lg"
        variant="outline"
      >
        <Icon className="size-5" icon={siFacebook} />
        Continue with Facebook
      </Button>
    </div>
  );
}
