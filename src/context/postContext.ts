import { createContext, useContext } from "react";

export type Postprops = {
  isComment: boolean;
  isOpen: boolean;
  setIsOpen: (isopen: boolean) => void;
  setIsComment: (isComment: boolean) => void;
};

export const PostContext = createContext<Postprops | null>(null);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
   throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};
