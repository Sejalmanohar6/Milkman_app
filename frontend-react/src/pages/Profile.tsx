import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ensureCsrf, readCsrf, safeJson } from '../lib/csrf';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/customers/me/', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load');
        const data = await safeJson<any>(res);
        if (data) {
          setForm({
            name: data.name || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
          });
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);
  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await ensureCsrf();
      const csrf = readCsrf() || '';
      const res = await fetch('/api/customers/upsert/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to save profile');
      }
      await safeJson(res);
    } catch (e: any) {
      setError(e.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h1 className="title">My Profile</h1>
      <form onSubmit={onSubmit} className="card stack" style={{ maxWidth: 640, margin: '0 auto', textAlign:'left' }}>
        <p><strong>User:</strong> {user?.username} {user?.is_staff ? '(staff)' : '(user)'}</p>
        <div className="section">
          <label>Name</label>
          <input
            className="form-control"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div className="section">
          <label>Phone</label>
          <input
            className="form-control"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            required
          />
        </div>
        <div className="section">
          <label>Email</label>
          <input
            className="form-control"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div className="section">
          <label>Address</label>
          <textarea
            className="form-control"
            rows={3}
            value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          />
        </div>
        {error && <p className="error" style={{ marginTop: '.5rem' }}>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>
    </section>
  );
}
