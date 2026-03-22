import { api, setAuthToken } from "./api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export const login = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  setAuthToken(data.token);
  return data;
};

export const register = async (name: string, email: string, password: string) => {
  const { data } = await api.post<AuthResponse>("/auth/register", { name, email, password });
  setAuthToken(data.token);
  return data;
};

export const fetchMe = async () => {
  const { data } = await api.get<UserProfile>("/auth/me");
  return data;
};
