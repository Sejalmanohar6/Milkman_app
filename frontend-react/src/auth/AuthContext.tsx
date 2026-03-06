import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ensureCsrf, readCsrf, safeJson } from '../lib/csrf';

type User = { id: number; username: string; email: string | null; is_staff: boolean };

type AuthValue = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};



const AuthCtx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await ensureCsrf();
        const res = await fetch('/api/auth/me/', { credentials: 'include' });
        if (res.ok) {
          const data = await safeJson<User>(res);
          setUser(data || null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const value = useMemo<AuthValue>(() => {
    return {
      user,
      loading,
      async login(username: string, password: string) {
        await ensureCsrf();
        const csrf = readCsrf();
        const res = await fetch('/api/auth/login/', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf || '' },
          body: JSON.stringify({ username, password }),
        });
        if (!res.ok) throw new Error('Invalid credentials');
        try {
          const me = await fetch('/api/auth/me/', { credentials: 'include' });
          if (me.ok) {
            const data = await safeJson<User>(me);
            setUser(data || null);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      },
      async logout() {
        await ensureCsrf();
        const csrf = readCsrf();
        await fetch('/api/auth/logout/', {
          method: 'POST',
          credentials: 'include',
          headers: { 'X-CSRFToken': csrf || '' },
        });
        setUser(null);
      },
    };
  }, [user, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
