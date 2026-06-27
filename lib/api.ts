export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://melody-aib.onrender.com';

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

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

export type Song = {
  id: string;
  title: string;
  genre: string;
  mood: string;
  status: string;
  progress: number;
  audioUrl?: string;
  createdAt: string;
  isFavorite?: boolean;
};

export type CreditLedgerEntry = {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  reason: string;
  createdAt: string;
};

export type Subscription = {
  id: string;
  tier: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  provider?: string;
};

type AuthPayload = {
  accessToken?: string;
  token?: string;
  user?: ApiUser;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  error?: string | { message?: string; code?: string };
  message?: string;
};

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
  if (typeof window === 'undefined') return;

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(user));

  document.cookie = `auth-token=${accessToken}; Path=/; Max-Age=900; SameSite=Lax`;
}

export function clearSession() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');

  document.cookie = 'auth-token=; Path=/; Max-Age=0; SameSite=Lax';
}

function getErrorMessage(data: any, fallback: string) {
  if (typeof data?.error === 'string') return data.error;
  if (data?.error?.message) return data.error.message;
  if (data?.message) return data.message;
  return fallback;
}

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
    throw new Error(getErrorMessage(data, `HTTP ${res.status}`));
  }

  return data as T;
}

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
    credentials: 'include',
  });

  return parseResponse<T>(res);
}

export async function apiPost<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  return parseResponse<T>(res);
}

export async function apiPatch<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  return parseResponse<T>(res);
}

export async function apiDelete<T = unknown>(path: string): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
  });

  return parseResponse<T>(res);
}

function normalizeAuthResponse(response: ApiEnvelope<AuthPayload> | AuthPayload) {
  const payload = 'data' in response && response.data ? response.data : response;

  const accessToken = payload.accessToken || payload.token;
  const user = payload.user;

  if (!accessToken || !user) {
    throw new Error('Login response missing token or user');
  }

  return { accessToken, user };
}

export async function login(email: string, password: string) {
  const response = await apiPost<ApiEnvelope<AuthPayload> | AuthPayload>(
    '/api/auth/login',
    { email, password }
  );

  const { accessToken, user } = normalizeAuthResponse(response);
  saveSession(accessToken, user);

  return { accessToken, user };
}

export async function register(name: string, email: string, password: string) {
  const response = await apiPost<ApiEnvelope<AuthPayload> | AuthPayload>(
    '/api/auth/register',
    { name, email, password }
  );

  const { accessToken, user } = normalizeAuthResponse(response);
  saveSession(accessToken, user);

  return { accessToken, user };
}

export function googleLoginUrl(): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${API_URL}/api/auth/google`,
    response_type: 'code',
    scope: 'openid email profile',
    state:
      typeof window !== 'undefined'
        ? encodeURIComponent(window.location.origin + '/dashboard')
        : '',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}
