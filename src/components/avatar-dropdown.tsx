import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { useCurrentUser } from "~/hooks/use-current-user";
import authClient from "../lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

export function AvatarDropdown() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, isAuthenticated, isPending } = useCurrentUser();

  if (isPending || !isAuthenticated) {
    return null;
  }

  const initials = getInitials(user?.name ?? "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full" variant="ghost">
          <Avatar className="h-8 w-8">
            <AvatarImage alt={user?.name ?? ""} src={user?.image ?? ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
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
