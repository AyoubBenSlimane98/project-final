import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
type GroupeState = {
  groupe: number;
  setGroupe: (groupe: number) => void;
};
export const useGroupeStore = create<GroupeState>()(
  devtools(
    persist(
      (set) => ({
        groupe: -1,
        setGroupe: (groupe: GroupeState["groupe"]) =>
          set({ groupe }, undefined, "groupe/setGroupe"),
      }),
      {
        name: "groupeUder",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      enabled: true,
      name: "groupe-Strore",
      store: "userGroupeStrore",
    }
  )
);
