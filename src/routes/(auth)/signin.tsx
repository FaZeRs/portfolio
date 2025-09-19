import { createFileRoute, redirect } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import {
  type SimpleIcon,
  siFacebook,
  siGithub,
  siGoogle,
  siX,
} from "simple-icons";
import Logo from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Icon from "~/components/ui/icon";
import authClient from "~/lib/auth-client";
import { cn } from "~/lib/utils";

const REDIRECT_URL = "/dashboard";

export const Route = createFileRoute("/(auth)/signin")({
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
                  <SignInButton
                    icon={siX}
                    label="Twitter (X)"
                    provider="twitter"
                  />
                  <SignInButton
                    icon={siGoogle}
                    label="Google"
                    provider="google"
                  />
                  <SignInButton
                    icon={siFacebook}
                    label="Facebook"
                    provider="facebook"
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
  provider: "discord" | "google" | "github" | "twitter" | "facebook";
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
