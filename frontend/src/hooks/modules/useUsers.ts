import { useState, useCallback, useRef } from 'react';
import {
  addUser as apiAddUser,
  listUsers as apiListUsers,
  removeUser as apiRemoveUser,
  updateUserPassword as apiUpdateUserPassword,
} from '../../api/users.api';
import type { User, AddUserPayload } from '../../api/users.api';

const LIMIT = 25;

interface UsersState {
  users: User[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

export function useUsers() {
  const [state, setState] = useState<UsersState>({ users: [], total: 0, hasMore: false, isLoading: false, isLoadingMore: false, error: null });

  const offsetRef = useRef(0);
  const hasMoreRef = useRef(false);
  const isLoadingMoreRef = useRef(false);

  const fetchInitial = useCallback(async () => {
    offsetRef.current = 0;
    isLoadingMoreRef.current = false;
    setState((prev) => ({ ...prev, users: [], total: 0, hasMore: false, isLoading: true, error: null }));
    try {
      const res = await apiListUsers(0, LIMIT);
      offsetRef.current = res.data.length;
      hasMoreRef.current = res.hasMore;
      setState({ users: res.data, total: res.total, hasMore: res.hasMore, isLoading: false, isLoadingMore: false, error: null });
    } catch (err: any) {
      const message = err?.response?.data?.error ?? err?.message ?? 'Failed to fetch users';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasMoreRef.current) return;
    isLoadingMoreRef.current = true;
    setState((prev) => ({ ...prev, isLoadingMore: true }));
    try {
      const res = await apiListUsers(offsetRef.current, LIMIT);
      offsetRef.current += res.data.length;
      hasMoreRef.current = res.hasMore;
      setState((prev) => ({
        ...prev,
        users: [...prev.users, ...res.data],
        total: res.total,
        hasMore: res.hasMore,
        isLoadingMore: false,
      }));
    } catch (err: any) {
      const message = err?.response?.data?.error ?? err?.message ?? 'Failed to load more';
      setState((prev) => ({ ...prev, isLoadingMore: false, error: message }));
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, []);

  const addUser = useCallback(async (payload: AddUserPayload) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const created = await apiAddUser(payload);
      setState((prev) => ({ ...prev, users: [...prev.users, created], isLoading: false }));
      return created;
    } catch (err: any) {
      const message = err?.response?.data?.error ?? err?.message ?? 'Failed to add user';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw err;
    }
  }, []);

  const removeUser = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await apiRemoveUser(id);
      setState((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      const message = err?.response?.data?.error ?? err?.message ?? 'Failed to remove user';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw err;
    }
  }, []);

  const updateUserPassword = useCallback(async (id: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await apiUpdateUserPassword(id, password);
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (err: any) {
      const message = err?.response?.data?.error ?? err?.message ?? 'Failed to update password';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw err;
    }
  }, []);

  return { ...state, fetchInitial, loadMore, addUser, removeUser, updateUserPassword, fetchUsers: fetchInitial };
}
