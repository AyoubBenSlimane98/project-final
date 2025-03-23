import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
type EmailState = {
  email: string;
  setEmail: (email: string) => void;
};
export const useEmailStore = create<EmailState>()(
  devtools(
    persist(
      (set) => ({
        email: "",
        setEmail: (email: EmailState["email"]) =>
          set({ email }, undefined, "email/setEmail"),
      }),
      {
        name: "userEmail",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      enabled: true,
      name: "email-Strore",
      store: "userEmailStrore",
    }
  )
);
