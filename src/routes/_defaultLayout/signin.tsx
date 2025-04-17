import { createFileRoute, redirect } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import type { SimpleIcon } from "simple-icons";
import { siGithub } from "simple-icons";
import authClient from "~/lib/auth-client";
import { Button } from "~/lib/components/ui/button";
import Icon from "~/lib/components/ui/icon";
import { cn } from "~/lib/utils";

const REDIRECT_URL = "/dashboard";

export const Route = createFileRoute("/_defaultLayout/signin")({
  component: AuthPage,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }
  },
});

function AuthPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-8 rounded-xl border bg-card p-10 shadow-sm">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <div className="flex w-full flex-col gap-3">
          <SignInButton
            provider="github"
            label="GitHub"
            icon={siGithub}
            className="bg-neutral-800 hover:bg-neutral-800/90"
          />
        </div>
      </div>
    </div>
  );
}

interface SignInButtonProps extends ComponentProps<typeof Button> {
  provider: "discord" | "google" | "github";
  label: string;
  icon: SimpleIcon;
}

function SignInButton({
  provider,
  label,
  icon,
  className,
  ...props
}: Readonly<SignInButtonProps>) {
  return (
    <Button
      onClick={() =>
        authClient.signIn.social({
          provider,
          callbackURL: REDIRECT_URL,
        })
      }
      type="button"
      size="lg"
      className={cn(
        "flex w-full items-center justify-center gap-2 text-white hover:text-white",
        className,
      )}
      {...props}
    >
      <Icon icon={icon} className="h-5 w-5" />
      <span>Sign in with {label}</span>
    </Button>
  );
}
