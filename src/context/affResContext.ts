import { createContext } from "react";

type AffResContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  binomeID: number | null;
  setBinomeID: (binomeID: number) => void;
};

export const AffResContext = createContext<AffResContextType>({
  isOpen: false,
  setIsOpen: () => {},
  binomeID: null,
  setBinomeID: () => {},
});
