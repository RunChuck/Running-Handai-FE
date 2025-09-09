import { create } from 'zustand';

interface BasicUserInfo {
  nickname: string;
  email: string;
}

interface UserState {
  userInfo: BasicUserInfo | null;
  setUserInfo: (userInfo: BasicUserInfo) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserState>(set => ({
  userInfo: null,

  setUserInfo: (userInfo: BasicUserInfo) => set({ userInfo }),

  clearUserInfo: () => set({ userInfo: null }),
}));
