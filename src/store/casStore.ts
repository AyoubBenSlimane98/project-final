import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type casState = {
  actor: string;
  next: boolean;
  allCas: string[];
};

export type ActionsCas = {
  createCas: (cas: string) => void;
  updateCas: (oldRef: string, newRef: string) => void;
  deleteCas: (ref: string) => void;
  setNext: (next: boolean) => void;
  setActor: (actor: string) => void;
  resetAll: () => void;
};

export const useCasStore = create<casState & ActionsCas>()(
  devtools(
    persist(
      immer((set) => ({
        actor: "",
        next: true,
        allCas: [],

        createCas: (cas) =>
          set((state) => {
            if (!state.allCas.includes(cas)) {
              state.allCas.push(cas);
            }
          }),

        updateCas: (oldCas, newCas) =>
          set((state) => {
            const index = state.allCas.indexOf(oldCas);
            if (index !== -1) state.allCas[index] = newCas;
          }),

        deleteCas: (cas: string) =>
          set((state) => {
            state.allCas = state.allCas.filter((item) => item !== cas);
          }),

        setNext: (next: boolean) =>
          set((state) => {
            state.next = next;
          }),
        setActor: (actor: string) =>
          set((state) => {
            state.actor = actor;
          }),

        resetAll: () =>
          set({
            actor: "",
            next: true,
            allCas: [],
          }),
      })),
      {
        name: "casStore",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: true, name: "cas-store" }
  )
);
