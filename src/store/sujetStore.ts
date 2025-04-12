import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type SujetState = {
  nom: string;
  description: string;
  refInputSuject: string[];
  prerequisInputSuject: string[];
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
        refInputSuject: [],
        prerequisInputSuject: [],

        addNom: (nom) => set({ nom }),
        addDescription: (description) => set({ description }),

        addReference: (ref) =>
          set((state) => {
            state.refInputSuject.push(ref);
          }),

        addPrerequis: (prev) =>
          set((state) => {
            state.prerequisInputSuject.push(prev);
          }),

        updateReference: (oldRef, newRef) =>
          set((state) => {
            const index = state.refInputSuject.indexOf(oldRef);
            if (index !== -1) state.refInputSuject[index] = newRef;
          }),

        updatePrerequis: (oldPrereq, newPrereq) =>
          set((state) => {
            const index = state.prerequisInputSuject.indexOf(oldPrereq);
            if (index !== -1) state.prerequisInputSuject[index] = newPrereq;
          }),
        deleteReference: (ref: string) =>
          set((state) => {
            state.refInputSuject = state.refInputSuject.filter(
              (item) => item !== ref
            );
          }),
        deletePrerequis: (prev: string) =>
          set((state) => {
            state.prerequisInputSuject = state.prerequisInputSuject.filter(
              (item) => item !== prev
            );
          }),
        resetAll: () =>
          set({
            nom: "",
            description: "",
            refInputSuject: [],
            prerequisInputSuject: [],
          }),
      })),
      {
        name: "sujetStore",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: true, name: "sujet-store" }
  )
);
