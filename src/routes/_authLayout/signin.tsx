import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { siGithub, type SimpleIcon } from "simple-icons";
import authClient from "~/lib/auth-client";
import Logo from "~/lib/components/logo";
import { Button } from "~/lib/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/lib/components/ui/card";
import Icon from "~/lib/components/ui/icon";
import { cn } from "~/lib/utils";

const REDIRECT_URL = "/dashboard";

export const Route = createFileRoute("/_authLayout/signin")({
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
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-medium">
          <Logo />
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <SignInButton provider="github" label="GitHub" icon={siGithub} />
                </div>
              </div>
            </CardContent>
          </Card>
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
      variant="outline"
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
