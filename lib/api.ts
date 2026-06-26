export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export type ApiUser = {
  id: string;
  email: string;
  name?: string;
  avatar?: string | null;
  role?: string;
  tier?: string;
  credits?: number;
  totalSongsGenerated?: number;
};

/**
 * Get stored token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

/**
 * Save session after login
 */
export function saveSession(accessToken: string, user: ApiUser) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Clear session
 */
export function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

/**
 * Safe JSON parser
 */
async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || 'Request failed');
  }

  return data as T;
}

/**
 * Base request (GET/POST/PATCH/DELETE)
 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  return parseResponse<T>(res);
}

/* =========================
   API METHODS
========================= */

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}

/* =========================
   AUTH API
========================= */

export async function login(email: string, password: string) {
  const res = await apiPost<{
    success: boolean;
    data: { accessToken: string; user: ApiUser };
  }>('/auth/login', { email, password });

  saveSession(res.data.accessToken, res.data.user);
  return res;
}

export async function register(name: string, email: string, password: string) {
  const res = await apiPost<{
    success: boolean;
    data: { accessToken: string; user: ApiUser };
  }>('/auth/register', { name, email, password });

  saveSession(res.data.accessToken, res.data.user);
  return res;
}

export async function getMe() {
  return apiGet('/auth/me');
}

/* =========================
   AI API
========================= */

export async function generateSong(data: any) {
  return apiPost('/studio/generate', data);
}

export async function getSong(songId: string) {
  return apiGet(`/songs/${songId}`);
}
