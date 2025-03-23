import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { BinomesTypes } from "../pages/enseignantResponsable/consultation/GroupeBinome";

export type AffCasState = {
  binomeId: number | null;
  nextStep: boolean;
  curentNextStep: boolean;
  confirm: boolean;
  cas: string[];
  user: BinomesTypes[];
};

export type ActionSAffCas = {
  addUser: (user: BinomesTypes[]) => void;
  setNextstep: (next: boolean) => void;
  setConfirm: (confirm: boolean) => void;
  setCurrentNextstep: (next: boolean) => void;
  setBinomeID: (id: number) => void;
  addCas: (cas: string) => void;
  deleteCas: (cas: string) => void;
  deleteAllCas: () => void;
};

export const useAffectionCasStore = create<AffCasState & ActionSAffCas>()(
  devtools(
    persist(
      immer((set) => ({
        binomeId: null,
        nextStep: false,
        confirm: false,
        curentNextStep: false,
        user: [],
        cas: [],

        setNextstep: (nextStep: boolean) =>
          set({ nextStep }, undefined, "AffectionCas|setNextstep"),
        setCurrentNextstep: (curentNextStep: boolean) =>
          set({ curentNextStep }, undefined, "AffectionCas|setCurrentNextstep"),
        setConfirm: (confirm: boolean) =>
          set({ confirm }, undefined, "AffectionCas|setConfirm"),
        setBinomeID: (binomeId: number) =>
          set({ binomeId }, undefined, "AffectionCas|setBinomeID"),
        addCas: (cas: string) =>
          set(
            (state) => {
              state.cas.push(cas);
            },
            undefined,
            "AffectionCas|addCas"
          ),
        addUser: (user: BinomesTypes[]) =>
          set(
            (state) => {
              state.user = user;
            },
            undefined,
            "AffectionCas|addUser"
          ),
        deleteCas: (cas: string) =>
          set(
            (state) => {
              state.cas = state.cas.filter((item) => item !== cas);
            },
            undefined,
            "AffectionCas|deleteCas"
          ),
        deleteAllCas: () =>
          set({ cas: [] }, undefined, "AffectionCas|deleteAllCas"),
      })),
      {
        name: "storeAffectionCas",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      enabled: true,
      name: "affection-cas-Store",
    }
  )
);
