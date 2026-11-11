import { create } from 'zustand';
import { User } from './auth.types';
import { setAccessToken } from '@/lib/axios';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  redirectAfterLogin: string | null;
  pendingFlightOffer: any | null;

  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setInitialized: (val: boolean) => void;
  setPendingRedirect: (url: string | null, flightOffer?: any) => void;
  clearPendingRedirect: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
  redirectAfterLogin: null,
  pendingFlightOffer: null,

  setAuth: (user, token) => {
    setAccessToken(token);
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      isInitialized: true,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  clearAuth: () => {
    setAccessToken(null);
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: true,
    });
  },

  setInitialized: (isInitialized) => {
    set({ isInitialized });
  },

  setPendingRedirect: (url, flightOffer = null) => {
    set({
      redirectAfterLogin: url,
      pendingFlightOffer: flightOffer,
    });
  },

  clearPendingRedirect: () => {
    set({
      redirectAfterLogin: null,
      pendingFlightOffer: null,
    });
  },
}));
