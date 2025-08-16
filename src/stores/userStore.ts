import { create } from 'zustand';
import { authAPI } from '@/api/auth';
import type { UserInfo } from '@/types/auth';

interface UserState {
  userInfo: UserInfo | null;
  isLoading: boolean;
  setUserInfo: (userInfo: UserInfo) => void;
  fetchUserInfo: () => Promise<void>;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserState>(set => ({
  userInfo: null,
  isLoading: false,

  setUserInfo: (userInfo: UserInfo) => set({ userInfo }),

  fetchUserInfo: async () => {
    set({ isLoading: true });
    try {
      const response = await authAPI.getUserInfo();
      set({ userInfo: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      set({ isLoading: false });
    }
  },

  clearUserInfo: () => set({ userInfo: null }),
}));
