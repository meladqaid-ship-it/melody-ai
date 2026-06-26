
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/* =========================
   TYPES
========================= */

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

/* =========================
   AUTH STORAGE
========================= */

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function getStoredUser(): ApiUser | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(accessToken: string, user: ApiUser) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

/* =========================
   BASE REQUEST
========================= */

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();

  const data = text
    ? (() => {
        try {
          return JSON.parse(text);
        } catch {
          return { message: text };
        }
      })()
    : {};

  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || 'Request failed');
  }

  return data as T;
}

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
   HTTP METHODS (EXPORTED)
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
   AUTH
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

/* =========================
   GOOGLE AUTH
========================= */

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export function googleLoginUrl(): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${API_URL}/auth/google`,
    response_type: 'code',
    scope: 'openid email profile',
    state: typeof window !== 'undefined'
      ? encodeURIComponent(window.location.origin + '/dashboard')
      : '',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export type Subscription = {
  id: string;
  tier: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  provider?: string;
};
