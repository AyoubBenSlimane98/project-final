import { createContext } from "react";

interface HeaderContextType {
  activeMenu: string | null;
  setActiveMenu: React.Dispatch<React.SetStateAction<string | null>>;
}

export const HeaderContext = createContext<HeaderContextType | undefined>(
  undefined
);
