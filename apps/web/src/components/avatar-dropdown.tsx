import { UserType } from "@acme/types";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { Spinner } from "@acme/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Suspense } from "react";
import authClient from "~/lib/auth/client";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

export function AvatarDropdown({ user }: { user: UserType }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const initials = getInitials(user?.name ?? "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full" variant="ghost">
          <Suspense fallback={<Spinner className="size-6" />}>
            <Avatar className="h-8 w-8">
              <AvatarImage alt={user?.name ?? ""} src={user?.image ?? ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Suspense>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">{user?.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        {user?.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.navigate({ to: "/dashboard" })}
            >
              Dashboard
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={() => router.navigate({ to: "/profile" })}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onResponse: async () => {
                  queryClient.setQueryData(["user"], null);
                  await router.invalidate();
                },
              },
            });
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
