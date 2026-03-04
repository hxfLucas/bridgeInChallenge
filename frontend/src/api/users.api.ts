import api from './axios';

export type UserRole = 'admin' | 'manager';
export type User = {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};
export type AddUserPayload = { email: string; name: string };

type ListUsersResponse = {
  items: User[];
};

export async function listUsers(): Promise<User[]> {
  const { data } = await api.get<ListUsersResponse>('/users/list');
  return data.items ?? [];
}

export async function addUser(payload: AddUserPayload): Promise<User> {
  const { data } = await api.post<User>('/users/add-user', payload);
  return data;
}

export async function removeUser(id: string): Promise<void> {
  await api.delete(`/users/remove-user/${id}`);
}
