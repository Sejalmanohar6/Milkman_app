import { useEffect, useState } from 'react';

type Sub = {
  id: number;
  product_detail?: { name: string; unit: string; price_per_unit: string };
  quantity_per_day: string;
  schedule_type: string;
  start_date: string;
  end_date: string | null;
};

export default function MySubscriptions() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/subscriptions/mine/', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load');
        setSubs(await res.json());
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
      <h1 className="title">My Subscriptions</h1>
      {!subs.length ? <p className="muted">No active subscriptions.</p> : (
        <div className="grid">
          {subs.map(s => (
            <div key={s.id} className="card stack">
              <div className="row-between">
                <h3 style={{ margin: 0 }}>{s.product_detail?.name}</h3>
                <span className="badge badge-info">{s.schedule_type}</span>
              </div>
              <div className="muted">Starts {s.start_date}{s.end_date ? ` • Ends ${s.end_date}` : ''}</div>
              <div><strong>{s.quantity_per_day}</strong> per day</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
