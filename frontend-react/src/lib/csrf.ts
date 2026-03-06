export function readCsrf(): string | null {
  const m = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export async function ensureCsrf() {
  await fetch('/api/auth/csrf/', { credentials: 'include' });
}

export async function safeJson<T = any>(res: Response): Promise<T | null> {
  const txt = await res.text();
  if (!txt) return null;
  try {
    return JSON.parse(txt) as T;
  } catch {
    return null;
  }
}
