import authClient from "~/lib/auth-client";

export const useCurrentUser = () => {
  const { data, isPending } = authClient.useSession();

  return {
    user: data?.user,
    isAuthenticated: Boolean(data?.user),
    isPending,
  };
};
