import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1 className="title">Login</h1>
      <form onSubmit={onSubmit} className="card stack" style={{ maxWidth: 480, margin: '0 auto', textAlign:'left' }}>
        <div className="section">
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required className="form-control" />
        </div>
        <div className="section">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="form-control" />
        </div>
        {error && <p className="error">{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign In'}</button>
        </div>
      </form>
      <p className="muted" style={{ textAlign: 'center', marginTop: '.75rem' }}>
        No account? <a href="/register">Create one</a>
      </p>
    </section>
  );
}
