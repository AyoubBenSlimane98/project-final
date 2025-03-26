import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Posts } from "../pages/admin/Consulter_annonces/ConsulterAnnonces";

type BlockedPostAdmin = {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
  setPosts: (posts: Posts[] | ((prevPost: Posts[]) => Posts[])) => void;
  selectionPost: Posts | null;
  setSelectionPost: (post: Posts | null) => void;
  selectionAllPosts: Posts[] | null;
  setSelectionAllPosts: (
    posts: Posts[] | ((prevSelection: Posts[]) => Posts[])
  ) => void;
};

export const BlockedPostContext = createContext<BlockedPostAdmin | null>(null);

export const useBlockedPostContext = () => {
  const context = useContext(BlockedPostContext);
  if (!context) {
    throw new Error(
      "useBlockedPostContext must be used within an BlockedPostContext"
    );
  }
  return context;
};
