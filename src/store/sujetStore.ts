import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type SujetState = {
  nom: string;
  description: string;
  references: string[];
  prerequis: string[];
};

export type ActionsSujet = {
  addNom: (nom: string) => void;
  addDescription: (description: string) => void;
  addReference: (ref: string) => void;
  addPrerequis: (prev: string) => void;
  updateReference: (oldRef: string, newRef: string) => void;
  updatePrerequis: (oldPrereq: string, newPrereq: string) => void;
  deleteReference: (ref: string) => void;
  deletePrerequis: (ref: string) => void;
  resetAll: () => void;
};

export const useSujetStore = create<SujetState & ActionsSujet>()(
  devtools(
    persist(
      immer((set) => ({
        nom: "",
        description: "",
        references: [],
        prerequis: [],

        addNom: (nom) => set({ nom }),
        addDescription: (description) => set({ description }),

        addReference: (ref) =>
          set((state) => {
            state.references.push(ref);
          }),

        addPrerequis: (prev) =>
          set((state) => {
            state.prerequis.push(prev);
          }),

        updateReference: (oldRef, newRef) =>
          set((state) => {
            const index = state.references.indexOf(oldRef);
            if (index !== -1) state.references[index] = newRef;
          }),

        updatePrerequis: (oldPrereq, newPrereq) =>
          set((state) => {
            const index = state.prerequis.indexOf(oldPrereq);
            if (index !== -1) state.prerequis[index] = newPrereq;
          }),
        deleteReference: (ref: string) =>
          set((state) => {
            state.references = state.references.filter((item) => item !== ref);
          }),
        deletePrerequis: (prev: string) =>
          set((state) => {
            state.prerequis = state.prerequis.filter((item) => item !== prev);
          }),
        resetAll: () =>
          set({ nom: "", description: "", references: [], prerequis: [] }),
      })),
      {
        name: "sujetStore",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: true, name: "sujet-store" }
  )
);
