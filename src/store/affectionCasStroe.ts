import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { BinomeUser } from "../pages/enseignantResponsable/gestion/affection_cas/FirstStep";

export type CasItem = {
  cas: string;
  idCas: number;
};
export type AffCasState = {
  acteur: string;
  idS: number;
  groupe: string;
  binomeId: number;
  nextStep: boolean;
  curentNextStep: boolean;
  confirm: boolean;
  cas: CasItem[];
  user: BinomeUser[];
  resetAll: () => void;
};

export type ActionSAffCas = {
  setGroupe: (nom: string) => void;
  setActeur: (nom: string) => void;
  setSujetID: (idS: number) => void;
  addUser: (user: BinomeUser[]) => void;
  setNextstep: (next: boolean) => void;
  setConfirm: (confirm: boolean) => void;
  setCurrentNextstep: (next: boolean) => void;
  setBinomeID: (id: number) => void;
  addCas: (item: CasItem) => void;
  deleteCas: (idCas: number) => void;
  deleteAllCas: () => void;
};

export const useAffectionCasStore = create<AffCasState & ActionSAffCas>()(
  devtools(
    persist(
      immer((set) => ({
        acteur: "",
        idS: -1,
        groupe: "",
        binomeId: -1,
        nextStep: false,
        confirm: false,
        curentNextStep: false,
        user: [],
        cas: [],
        resetAll: () =>
          set(
            () => ({
              acteur: "",
              idS: -1,
              groupe: "",
              binomeId: -1,
              nextStep: false,
              confirm: false,
              curentNextStep: false,
              user: [],
              cas: [],
            }),
            undefined,
            "AffectionCas|resetAll"
          ),
        setNextstep: (nextStep: boolean) =>
          set({ nextStep }, undefined, "AffectionCas|setNextstep"),
        setCurrentNextstep: (curentNextStep: boolean) =>
          set({ curentNextStep }, undefined, "AffectionCas|setCurrentNextstep"),
        setConfirm: (confirm: boolean) =>
          set({ confirm }, undefined, "AffectionCas|setConfirm"),
        setBinomeID: (binomeId: number) =>
          set({ binomeId }, undefined, "AffectionCas|setBinomeID"),
        addCas: (item: CasItem) =>
          set(
            (state) => {
              // empêche les doublons (optionnel)
              const exists = state.cas.some((c) => c.idCas === item.idCas);
              if (!exists) {
                state.cas.push(item);
              }
            },
            undefined,
            "AffectionCas|addCas"
          ),
        setActeur: (acteur: string) =>
          set(
            (state) => {
              state.acteur = acteur;
            },
            undefined,
            "AffectionCas|setGroupe"
          ),
        setGroupe: (nom: string) =>
          set(
            (state) => {
              state.groupe = nom;
            },
            undefined,
            "AffectionCas|setGroupe"
          ),
        setSujetID: (idS: number) =>
          set(
            (state) => {
              state.idS = idS;
            },
            undefined,
            "AffectionCas|setSujetID"
          ),
        addUser: (user: BinomeUser[]) =>
          set(
            (state) => {
              state.user = user;
            },
            undefined,
            "AffectionCas|addUser"
          ),
        deleteCas: (idCas: number) =>
          set(
            (state) => {
              state.cas = state.cas.filter((item) => item.idCas !== idCas);
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
