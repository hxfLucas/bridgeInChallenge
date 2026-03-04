import api from './axios';

export type MagicLink = {
  id: string;
  reportingToken: string;
  company: { id: string };
  createdAt: string;
};

export async function listMagicLinks(): Promise<MagicLink[]> {
  const { data } = await api.get<MagicLink[]>('/magiclinks/list');
  return data;
}

export async function createMagicLink(): Promise<MagicLink> {
  const { data } = await api.post<MagicLink>('/magiclinks/create-new-magiclink');
  return data;
}

export async function deleteMagicLink(id: string): Promise<void> {
  await api.delete(`/magiclinks/delete-magiclink/${id}`);
}
