import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your machine's local IP when testing on a real device
// e.g. 'http://192.168.1.10:5000'
const BASE_URL = 'http://localhost:5000';

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('ineza_token');
}

async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: object
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data as T;
}

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (nickname: string, district: string, language: string, pin: string) =>
    request<any>('POST', '/api/auth/register', { nickname, district, language, pin }),

  login: (userId: string, pin: string) =>
    request<any>('POST', '/api/auth/login', { userId, pin }),

  chwLogin: (phone: string, password: string) =>
    request<any>('POST', '/api/auth/chw/login', { phone, password }),
};

// ── Journal ───────────────────────────────────────────
export const journalAPI = {
  save: (text: string, date: string) =>
    request<any>('POST', '/api/journal', { text, date }),

  getAll: (limit = 30) =>
    request<any>('GET', `/api/journal?limit=${limit}`),

  getByDate: (date: string) =>
    request<any>('GET', `/api/journal/${date}`),
};

// ── Tracker ───────────────────────────────────────────
export const trackerAPI = {
  save: (data: {
    date: string;
    mood?: number | null;
    sleep?: number;
    ate?: string | null;
    cried?: boolean | null;
    babyBond?: number | null;
    anxiety?: string | null;
    social?: boolean | null;
  }) => request<any>('POST', '/api/tracker', data),

  getAll: (days = 30) =>
    request<any>('GET', `/api/tracker?days=${days}`),

  getByDate: (date: string) =>
    request<any>('GET', `/api/tracker/${date}`),
};

// ── SOS ───────────────────────────────────────────────
export const sosAPI = {
  trigger: () =>
    request<any>('POST', '/api/sos'),

  getAlerts: () =>
    request<any>('GET', '/api/sos/alerts'),

  resolveAlert: (alertId: string) =>
    request<any>('PATCH', `/api/sos/alerts/${alertId}/resolve`),
};

// ── Peers ─────────────────────────────────────────────
export const peersAPI = {
  getMessages: (district?: string) =>
    request<any>('GET', `/api/peers${district ? `?district=${district}` : ''}`),

  post: (text: string) =>
    request<any>('POST', '/api/peers', { text }),

  react: (messageId: string, type: 'heart' | 'pray') =>
    request<any>('PATCH', `/api/peers/${messageId}/react`, { type }),
};

// ── CHW ───────────────────────────────────────────────
export const chwAPI = {
  getUsers: () =>
    request<any>('GET', '/api/chw/users'),

  getUserSummary: (userId: string) =>
    request<any>('GET', `/api/chw/users/${userId}/summary`),
};
