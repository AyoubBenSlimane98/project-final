import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
type EtudiantState = {
  idB: number;
  idG: number;
  idS: number;
  acteur: string;
  setSujetId: (idB: number) => void;
  setGroupId: (idG: number) => void;
  setBinomeId: (idB: number) => void;
  setActeur: (acteur: string) => void;
};
export const useEtudiantStore = create<EtudiantState>()(
  devtools(
    persist(
      (set) => ({
        acteur: "",
        idS: -1,
        idB: -1,
        idG: -1,
        setBinomeId: (idB: number) =>
          set({ idB }, undefined, "idB/setBinomeId"),
        setGroupId: (idG: number) => set({ idG }, undefined, "idG/setGroupId"),
        setSujetId: (idS: number) => set({ idS }, undefined, "idS/setSujet"),
        setActeur: (acteur: string) =>
          set({ acteur }, undefined, "acteur/setActeur"),
      }),
      {
        name: "userEmail",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      enabled: true,
      name: "etudiant-Strore",
      store: "userEtudiantStrore",
    }
  )
);
