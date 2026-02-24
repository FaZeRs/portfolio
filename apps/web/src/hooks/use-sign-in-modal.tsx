import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";

interface SignInModalState {
  open: boolean;
}

const signInModalStore = new Store<SignInModalState>({
  open: false,
});

export const useSignInModal = () => {
  const open = useStore(signInModalStore, (state) => state.open);

  const setOpen = (value: boolean) => {
    signInModalStore.setState((prev) => ({
      ...prev,
      open: value,
    }));
  };

  return { open, setOpen };
};
