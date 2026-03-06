import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ensureCsrf, readCsrf } from '../lib/csrf';
import { useAuth } from '../auth/AuthContext';

type Category = { id: number; name: string };

export default function AddProduct() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [unit, setUnit] = useState('liter');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const res = await fetch('/api/categories/');
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    };
    run();
  }, []);

  if (!user) {
    return (
      <section>
        <h1 className="title">Add Product</h1>
        <p className="muted">You must be logged in to add products.</p>
      </section>
    );
  }
  if (user && !user.is_staff) {
    return (
      <section>
        <h1 className="title">Add Product</h1>
        <p className="error">Only staff users can add products. Please contact an administrator.</p>
      </section>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!name || !categoryId || !price) {
      setError('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await ensureCsrf();
      const csrf = readCsrf() || '';
      const res = await fetch('/api/products/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf },
        body: JSON.stringify({
          name,
          category: Number(categoryId),
          unit,
          price_per_unit: price,
          image_url: imageUrl || undefined,
          is_active: true,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to add product');
      }
      navigate('/products');
    } catch (e: any) {
      setError(e.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1 className="title">Add Product</h1>
      <form onSubmit={onSubmit} className="card" style={{ padding: '1rem', maxWidth: 520 }}>
        <div>
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required className="form-control" />
        </div>
        <div style={{ marginTop: '.75rem' }}>
          <label>Category</label>
          <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value) || '')} required className="form-control">
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ marginTop: '.75rem' }}>
          <label>Unit</label>
          <input value={unit} onChange={e => setUnit(e.target.value)} className="form-control" />
        </div>
        <div style={{ marginTop: '.75rem' }}>
          <label>Price per Unit</label>
          <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required className="form-control" />
        </div>
        <div style={{ marginTop: '.75rem' }}>
          <label>Image URL</label>
          <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://…" className="form-control" />
        </div>
        {imageUrl && (
          <div style={{ marginTop: '.5rem' }}>
            <img src={imageUrl} alt="Preview" className="product-img" />
          </div>
        )}
        {error && <p className="error" style={{ marginTop: '.75rem' }}>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Adding…' : 'Add Product'}</button>
        </div>
      </form>
    </section>
  );
}
