const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || data?.message || 'Request failed');
  }

  return data;
}

export const api = {
  login: (data: any) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: any) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request('/auth/me'),

  generateSong: (data: any) =>
    request('/studio/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSong: (id: string) => request(`/songs/${id}`),
};
