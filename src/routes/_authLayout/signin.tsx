import { createFileRoute, redirect } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { type SimpleIcon, siGithub } from "simple-icons";
import Logo from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Icon from "~/components/ui/icon";
import authClient from "~/lib/auth-client";
import { cn } from "~/lib/utils";

const REDIRECT_URL = "/dashboard";

export const Route = createFileRoute("/_authLayout/signin")({
  component: AuthPage,
  beforeLoad: ({ context }) => {
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
        <Logo className="self-center" />
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <SignInButton
                    icon={siGithub}
                    label="GitHub"
                    provider="github"
                  />
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
      className={cn(
        "flex w-full items-center justify-center gap-2 text-white hover:text-white",
        className
      )}
      onClick={() =>
        authClient.signIn.social({
          provider,
          callbackURL: REDIRECT_URL,
        })
      }
      size="lg"
      type="button"
      variant="outline"
      {...props}
    >
      <Icon className="h-5 w-5" icon={icon} />
      <span>Sign in with {label}</span>
    </Button>
  );
}
