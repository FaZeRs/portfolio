import { authProviders } from "@acme/config";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import SignInButton from "@acme/ui/sign-in-button";
import Logo from "./logo";

export default function SignIn({
  onClick,
}: {
  onClick: (provider: string) => void;
}) {
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
                  {authProviders.map((provider) => (
                    <SignInButton
                      icon={provider.icon}
                      key={provider.provider}
                      label={provider.label}
                      onClick={() => onClick(provider.provider)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
