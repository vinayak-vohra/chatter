import { create } from "zustand";
import { Pages } from "../types/Pages";

export type PageStore = {
  page: Pages | null;
  setPage: (page: Pages) => void;
};

export const usePageStore = create<PageStore>((set) => ({
  page: null,
  setPage(page) {
    set({ page });
  },
}));
