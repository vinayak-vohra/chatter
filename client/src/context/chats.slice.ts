import { create } from "zustand";

type ChatStore = {
  isChatLoading: boolean;

  onChatChange: (id?: string) => void;
};

const ChatStore = create<ChatStore>((set) => ({
  isChatLoading: false,
  onChatChange(id) {
    set({ isChatLoading: true });
    
    if (id) {
    }
    set({ isChatLoading: false });
  },
}));
