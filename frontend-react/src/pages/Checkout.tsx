import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { ensureCsrf, readCsrf, safeJson } from '../lib/csrf';

type Bill = {
  id: number;
  subtotal: string;
  total: string;
  items: Array<{
    id: number;
    product_name: string;
    unit_price: string;
    days_count: number;
    line_total: string;
  }>;
};

export default function Checkout() {
  const { items, clear } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const empty = !items.length;

  const suggestedPeriod = useMemo(() => {
    const hasYearly = items.some(i => i.plan === 'yearly');
    const hasMonthly = items.some(i => i.plan === 'monthly');
    const now = new Date();
    const start = now.toISOString().slice(0, 10);
    if (hasYearly) {
      const end = new Date(now); end.setFullYear(end.getFullYear() + 1);
      return { start, end: end.toISOString().slice(0,10) };
    }
    if (hasMonthly) {
      const end = new Date(now); end.setMonth(end.getMonth() + 1);
      return { start, end: end.toISOString().slice(0,10) };
    }
    const end = new Date(now); end.setDate(end.getDate() + 7);
    return { start, end: end.toISOString().slice(0,10) };
  }, [items]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (empty) return;
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const email = String(form.get('email') || '');
    const address = String(form.get('address') || '');
    setSubmitting(true);
    setError(null);
    try {
      await ensureCsrf();
      const csrf = readCsrf() || '';
      // 1) Ensure customer
      let customerId: number | null = null;
      const createRes = await fetch('/api/customers/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf },
        body: JSON.stringify({ name, phone, email, address, is_active: true }),
      });
      if (createRes.ok) {
        const created = await safeJson<any>(createRes);
        if (created && created.id) {
          customerId = created.id;
        }
      }
      if (!customerId) {
        // try to find existing by fetching all and matching phone
        const listRes = await fetch('/api/customers/');
        if (!listRes.ok) throw new Error('Cannot find customer');
        const list = await listRes.json();
        const found = Array.isArray(list) ? list.find((c: any) => c.phone === phone) : null;
        if (!found) throw new Error('Customer not found and cannot be created');
        customerId = found.id;
      }
      if (!customerId) throw new Error('No customer id');
      // bind to current user if logged in
      if (customerId) {
        await fetch(`/api/customers/${customerId}/bind-user/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'X-CSRFToken': csrf },
        });
      }

      // 2) Create subscriptions for items with subscription plans
      for (const it of items) {
        let end_date: string | null = null;
        const start_date = suggestedPeriod.start;
        if (it.plan === 'monthly') {
          end_date = suggestedPeriod.end;
        } else if (it.plan === 'yearly') {
          end_date = suggestedPeriod.end;
        }
        if (it.plan !== 'one-time') {
          await fetch('/api/subscriptions/', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf },
            body: JSON.stringify({
              customer: customerId,
              product: it.productId,
              quantity_per_day: it.quantityPerDay,
              schedule_type: it.scheduleType,
              start_date,
              end_date,
              is_active: true,
            }),
          });
        }
      }

      // 3) Generate bill for the selected period
      const billRes = await fetch('/api/bills/generate/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf },
        body: JSON.stringify({
          customer_id: customerId,
          period_start: suggestedPeriod.start,
          period_end: suggestedPeriod.end,
        }),
      });
      if (!billRes.ok) throw new Error('Failed to generate bill');
      const bill = await safeJson<Bill>(billRes);
      if (!bill) throw new Error('Failed to parse bill');

      // 4) Simulate payment success
      clear();
      const params = new URLSearchParams({
        total: bill.total,
      });
      navigate(`/success?${params.toString()}`);
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <section>
        <h1 className="title">Checkout</h1>
        <p className="muted">You need to be logged in to checkout.</p>
        <a className="btn btn-primary" href="/login">Login</a>
      </section>
    );
  }

  return (
    <section>
      <h1 className="title">Checkout</h1>
      {empty ? (
        <p className="muted">Your cart is empty.</p>
      ) : (
        <form onSubmit={onSubmit} className="card stack">
          <div style={{ display: 'grid', gap: '.75rem', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label>Name</label>
              <input name="name" required className="form-control" />
            </div>
            <div>
              <label>Phone</label>
              <input name="phone" required className="form-control" placeholder="+919999999999" />
            </div>
            <div>
              <label>Email</label>
              <input name="email" type="email" className="form-control" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Address</label>
              <textarea name="address" className="form-control" rows={3} />
            </div>
          </div>
          <div className="row-between">
            <div>
              <strong>Billing period</strong>
              <div className="muted">
                {suggestedPeriod.start} → {suggestedPeriod.end}
              </div>
            </div>
            <div>
              <strong className="muted">Calculated at bill generation</strong>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="row-between">
            <div />
            <button disabled={submitting} className="btn btn-primary">
              {submitting ? 'Processing…' : 'Pay & Subscribe'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
