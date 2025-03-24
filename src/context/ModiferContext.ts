import { createContext, useContext } from "react";

import { BinomesTypes } from "../pages/enseignantResponsable/consultation/GroupeBinome";

type ModiferState = {
  resetUser: BinomesTypes[];
  setResetUser: React.Dispatch<React.SetStateAction<BinomesTypes[]>>;
  rowSelection: BinomesTypes[];
  setRowSelection: React.Dispatch<React.SetStateAction<BinomesTypes[]>>;
};

export const ModiferContext = createContext<ModiferState | null>(null);

export const useModierContext = () => {
  const context = useContext(ModiferContext);
  if (!context) {
    throw new Error("useModierContext must be used within an GestionProvider");
  }
  return context;
};
