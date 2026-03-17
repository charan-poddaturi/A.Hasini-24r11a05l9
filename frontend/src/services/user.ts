import { api } from "./api";

export interface EmergencyContact {
  _id: string;
  name: string;
  relation: string;
  phone: string;
  isVerified: boolean;
}

export const getProfile = async () => {
  const { data } = await api.get("/users/profile");
  return data;
};

export const addContact = async (contact: { name: string; relation: string; phone: string }) => {
  const { data } = await api.post<EmergencyContact>("/users/emergency-contacts", contact);
  return data;
};

export const updateContact = async (id: string, updates: Partial<EmergencyContact>) => {
  const { data } = await api.put<EmergencyContact>(`/users/emergency-contacts/${id}`, updates);
  return data;
};

export const deleteContact = async (id: string) => {
  await api.delete(`/users/emergency-contacts/${id}`);
};
