import { create } from "zustand";
import { UserSlice, useUserSlice } from "./user.slice";

export const useAppStore = create<UserSlice, []>((...a) => ({
  ...useUserSlice(...a),
}));


