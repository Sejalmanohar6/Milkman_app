import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ensureCsrf, readCsrf } from '../lib/csrf';


export default function Register() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password1 !== password2) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await ensureCsrf();
      const csrf = readCsrf() || '';
      const res = await fetch('/api/users/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf },
        body: JSON.stringify({ username, email: email || null, password: password1 }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Registration failed');
      }
      await login(username, password1);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1 className="title">Create Account</h1>
      <form onSubmit={onSubmit} className="card stack" style={{ maxWidth: 520, margin: '0 auto', textAlign:'left' }}>
        <div className="section">
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required className="form-control" />
        </div>
        <div className="section">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
        </div>
        <div className="section">
          <label>Password</label>
          <input type="password" value={password1} onChange={e => setPassword1(e.target.value)} required className="form-control" />
        </div>
        <div className="section">
          <label>Confirm Password</label>
          <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} required className="form-control" />
        </div>
        {error && <p className="error">{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating…' : 'Create Account'}</button>
        </div>
      </form>
    </section>
  );
}
