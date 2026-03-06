import { useEffect, useState } from 'react';

type BillItem = {
  id: number;
  product_name: string;
  unit_price: string;
  quantity_per_day: string;
  days_count: number;
  line_total: string;
};
type Bill = {
  id: number;
  period_start: string;
  period_end: string;
  subtotal: string;
  total: string;
  items: BillItem[];
  created_at: string;
};

export default function BillingHistory() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/bills/mine/', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load');
        setBills(await res.json());
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
  return (
    <section>
      <h1 className="title">Billing History</h1>
      {!bills.length ? <p className="muted">No bills yet.</p> : (
        bills.map(b => (
          <div key={b.id} className="card stack" style={{ marginBottom: '.75rem' }}>
            <div className="row-between">
              <strong>#{b.id} • {b.period_start} → {b.period_end}</strong>
              <span className="badge badge-info">₹ {b.total}</span>
            </div>
            <div className="muted">{new Date(b.created_at).toLocaleString()}</div>
            <ul className="list">
              {b.items.map(it => (
                <li key={it.id}>
                  <div className="row-between">
                    <span>{it.product_name}</span>
                    <span className="muted">₹ {it.unit_price} × {Number(it.quantity_per_day)} × {it.days_count}d</span>
                  </div>
                  <div className="row-between" style={{ marginTop: '.25rem' }}>
                    <span className="muted">Line total</span>
                    <strong>₹ {it.line_total}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
