import { apiFetch } from './client';

export interface AuthResponse {
  access_token: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  createdAt: string;
}

export function loginRequest(email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function registerRequest(email: string, password: string) {
  return apiFetch<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
