import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './auth.store';
import { authApi } from './auth.api';
import { LoginInput, RegisterInput } from './auth.types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isInitialized,
    redirectAfterLogin,
    pendingFlightOffer,
    setAuth,
    clearAuth,
    setInitialized,
    clearPendingRedirect,
  } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(['currentUser'], data.user);

      if (redirectAfterLogin) {
        const dest = redirectAfterLogin;
        clearPendingRedirect();
        navigate(dest, { replace: true, state: { preservedFlight: pendingFlightOffer } });
      } else {
        navigate('/', { replace: true });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(['currentUser'], data.user);

      if (redirectAfterLogin) {
        const dest = redirectAfterLogin;
        clearPendingRedirect();
        navigate(dest, { replace: true, state: { preservedFlight: pendingFlightOffer } });
      } else {
        navigate('/', { replace: true });
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });

  // Transparent session recovery on app mount
  useEffect(() => {
    if (!isInitialized) {
      authApi
        .refresh()
        .then((data) => {
          setAuth(data.user, data.accessToken);
        })
        .catch(() => {
          clearAuth();
        })
        .finally(() => {
          setInitialized(true);
        });
    }
  }, [isInitialized, setAuth, clearAuth, setInitialized]);

  return {
    user,
    isAuthenticated,
    isInitialized,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
};
