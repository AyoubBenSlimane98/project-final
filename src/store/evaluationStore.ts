import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
type EvaluationState = {
  idB: number;
  idG: number;
  idEtape: number;
  setEtapeId: (idB: number) => void;
  setGroupId: (idG: number) => void;
  setBinomeId: (idB: number) => void;
};
export const useEvaluationStore = create<EvaluationState>()(
  devtools(
    persist(
      (set) => ({
        idEtape: -1,
        idB: -1,
        idG: -1,
        setBinomeId: (idB: number) =>
          set({ idB }, undefined, "idB/setBinomeId"),
        setGroupId: (idG: number) => set({ idG }, undefined, "idG/setGroupId"),
        setEtapeId: (idEtape: number) =>
          set({ idEtape }, undefined, "idS/setTache"),
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
