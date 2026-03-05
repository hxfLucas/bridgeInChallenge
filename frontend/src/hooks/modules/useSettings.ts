import { useState } from 'react';
import { changeOwnPassword as changeOwnPasswordApi, signOutAllDevices as signOutAllDevicesApi } from '../../api/users.api';
import { useAuth } from './useAuth';

interface ActionState {
  isLoading: boolean;
  error: string | null;
}

const defaultState: ActionState = { isLoading: false, error: null };

export function useSettings() {
  const { signOut } = useAuth();

  const [changePasswordState, setChangePasswordState] = useState<ActionState>(defaultState);
  const [signOutAllDevicesState, setSignOutAllDevicesState] = useState<ActionState>(defaultState);

  async function changePassword(payload: { currentPassword: string; newPassword: string }) {
    setChangePasswordState({ isLoading: true, error: null });
    try {
      await changeOwnPasswordApi(payload);
      setChangePasswordState({ isLoading: false, error: null });
    } catch (err: any) {
      setChangePasswordState({
        isLoading: false,
        error: err?.response?.data?.error ?? err?.message ?? 'An error occurred',
      });
    }
  }

  async function signOutAllDevices() {
    setSignOutAllDevicesState({ isLoading: true, error: null });
    try {
      await signOutAllDevicesApi();
      setSignOutAllDevicesState({ isLoading: false, error: null });
      signOut();
    } catch (err: any) {
      setSignOutAllDevicesState({
        isLoading: false,
        error: err?.response?.data?.error ?? err?.message ?? 'An error occurred',
      });
    }
  }

  return {
    changePassword,
    changePasswordState,
    signOutAllDevices,
    signOutAllDevicesState,
  };
}
