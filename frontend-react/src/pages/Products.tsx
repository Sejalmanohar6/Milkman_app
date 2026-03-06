import { useEffect, useState } from 'react';
import { useCart } from '../cart/CartContext';
import { productImageUrl } from '../lib/images';

type Product = {
  id: number;
  name: string;
  category_name?: string;
  unit: string;
  price_per_unit: string;
  image_url?: string | null;
};

type Category = { id: number; name: string };

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [q, setQ] = useState('');
  const { add } = useCart();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/categories/');
        if (res.ok) {
          const data = await res.json();
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch {}
    };
    run();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (categoryId) params.set('category', String(categoryId));
        if (q.trim()) params.set('q', q.trim());
        const res = await fetch(`/api/products/${params.toString() ? `?${params.toString()}` : ''}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setItems(data);
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchProducts, 250);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [categoryId, q]);

  if (loading) return <p>Loading products…</p>;
  if (error) return <p className="error">Failed to load: {error}</p>;

  return (
    <section>
      <h1 className="title">Products</h1>
      <div className="row" style={{ marginBottom: '.75rem', flexWrap: 'wrap' }}>
        <select className="form-control" style={{ maxWidth: 240 }} value={categoryId}
                onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          className="form-control"
          placeholder="Search products…"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ minWidth: 240 }}
        />
      </div>
      <div className="grid">
        {items.map(p => (
          <div key={p.id} className="card stack">
            <img
              src={p.image_url || productImageUrl(p.name)}
              alt={p.name}
              className="product-img"
              loading="lazy"
            />
            <div className="row-between">
              <h3 style={{ margin: 0 }}>{p.name}</h3>
              {p.category_name && <span className="badge badge-muted">{p.category_name}</span>}
            </div>
            <div className="row-between">
              <span className="muted">₹ {p.price_per_unit} / {p.unit}</span>
              <button
                className="btn btn-primary"
                onClick={() =>
                  add({
                    productId: p.id,
                    name: p.name,
                    unit: p.unit,
                    price: Number(p.price_per_unit),
                    quantityPerDay: 1,
                    scheduleType: 'DAILY',
                    plan: 'monthly',
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
