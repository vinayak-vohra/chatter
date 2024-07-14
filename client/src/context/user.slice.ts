import { toast } from "sonner";
import { StateCreator } from "zustand";
import { User as FirebaseUser, updateProfile } from "firebase/auth";

import { getUserInfo } from "../api";
import { User } from "../types/User";
import errorLogger from "../utils/errorLogger";
import { auth } from "../config/firebase";

type UpdateParams = Pick<FirebaseUser, "displayName" | "photoURL">;

export type UserSlice = {
  user: User | null;
  hasUserMounted: boolean;
  loading: boolean;
  updateParams?: UpdateParams;

  setUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  setUpdateParams: (updateParams: UpdateParams) => void;
};

export const useUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set,
  get
) => ({
  user: null,
  hasUserMounted: false,
  loading: false,

  async setUser(user) {
    const { loading, updateParams } = get();

    try {
      // logged in user found
      if (user) {
        // newly registered user
        if (!user.displayName) await updateProfile(user, { ...updateParams });

        // fetch user info from backend
        const resp = await getUserInfo(await user.getIdToken(true));

        if (loading) toast.success("Logged In");
        set({ user: resp.data });
      }
      // no logged in user
      else {
        set({ user: null });
      }
    } catch (error: any) {
      errorLogger(error);
      await auth.signOut();
    }

    set({ loading: false, hasUserMounted: true });
  },
  setLoading(loading) {
    set({ loading });
  },
  setUpdateParams(updateParams) {
    set({ updateParams });
  },
});
