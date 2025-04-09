import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
interface AuthStore {
  accessToken: string | undefined;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        accessToken: undefined,
        setAccessToken: (token: string) =>
          set({ accessToken: token }, undefined, "AceessToken"),
      })),
      {
        name: "authToken",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      enabled: true,
      name: "auth-Store",
    }
  )
);
