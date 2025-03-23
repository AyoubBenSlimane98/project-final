import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type ChatState = {
  user: {
    image: string;
    firstName: string;
    lastName: string;
    lastMessage: string;
    currentDate: string;
    messageValid: number;
  };
  status: {
    isOpen: boolean;
  };
};

export type ActionChats = {
  setDataUser: (user: ChatState["user"]) => void;
  setStatus: (isOpen: boolean) => void;
};

export const useChatStore = create<ChatState & ActionChats>()(
  devtools(
    persist(
      immer((set) => ({
        user: {
          image:
            "https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          firstName: "Ayyoub",
          lastName: "Benslimane",
          lastMessage: "Hello",
          currentDate: "Dec 03",
          messageValid: 0,
        },
        status: {
          isOpen: false,
        },
        setDataUser: (user) =>
          set(
            (state) => {
              state.user = user;
            },
            false,
            "setDataUser"
          ),
        setStatus: (isOpen) =>
          set(
            (state) => {
              state.status.isOpen = isOpen;
            },
            false,
            "setStatus"
          ),
      })),
      {
        name: "storeChatUser",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      enabled: true,
      name: "chat-Store",
    }
  )
);
