import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { BinomeUser } from "../pages/enseignantResponsable/gestion/affection_cas/FirstStep";

type Groupe = {
  idG: number;
  nom: string;
};

type Responsabilite = {
  key: string;
  label: string;
};

export type AffResState = {
  idB: number;
  responsabilite: Responsabilite;
  groupe: Groupe;
  users: BinomeUser[];
};

export type ActionRes = {
  setBinomeID: (idB: number) => void;
  setGroupe: (groupe: Groupe) => void;
  setResponsabilite: (responsabilite: Responsabilite) => void;
  addUsers: (users: BinomeUser[]) => void;
  resetAll: () => void;
};

export const useResponsablStore = create<AffResState & ActionRes>()(
  devtools(
    persist(
      immer((set) => ({
        idB: -1,
        responsabilite: { key: "", label: "" },
        groupe: { idG: -1, nom: "" },
        users: [],

        setBinomeID: (idB) =>
          set((state) => {
            state.idB = idB;
          }),

        setResponsabilite: (responsabilite: Responsabilite) =>
          set((state) => {
            state.responsabilite = responsabilite;
          }),

        setGroupe: (groupe) =>
          set((state) => {
            state.groupe = groupe;
          }),

        addUsers: (users: BinomeUser[]) =>
          set((state) => {
            state.users = users;
          }),

        resetAll: () =>
          set((state) => {
            state.idB = -1;
            state.responsabilite = { key: "", label: "" };
            state.groupe = { idG: -1, nom: "" };
            state.users = [];
          }),
      })),
      {
        name: "storeAffectionResponsabilite",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      name: "affection-Responsabilite-Store",
    }
  )
);
