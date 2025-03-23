import { createContext, useContext } from "react";
import { Posts } from "../pages/admin/Consulter_annonces/ConsulterAnnonces";

type AnnocesAdmin = {
  blockPost: (post: Posts) => void;
  blockedPosts: Posts[];
  setPostToDelete: (post: Posts | null) => void;
};

export const AnnoncesContext = createContext<AnnocesAdmin | null>(null);

export const useAnnocesContext = () => {
  const context = useContext(AnnoncesContext);
  if (!context) {
    throw new Error(
      "useAnnocesContext must be used within an AnnoncesProvider"
    );
  }
  return context;
};
