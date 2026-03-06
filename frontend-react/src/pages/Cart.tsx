import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext';

export default function Cart() {
  const { items, subtotal, update, remove } = useCart();
  const navigate = useNavigate();
  if (!items.length) {
    return (
      <section>
        <h1 className="title">Your Cart</h1>
        <p className="muted">Your cart is empty.</p>
        <Link className="btn btn-primary" to="/products">Browse products</Link>
      </section>
    );
  }
  return (
    <section>
      <h1 className="title">Your Cart</h1>
      <div className="grid">
        {items.map(i => (
          <div className="card stack" key={i.productId}>
            <div className="row-between">
              <h3 style={{ margin: 0 }}>{i.name}</h3>
              <span className="muted">₹ {i.price} / {i.unit}</span>
            </div>
            <div className="row">
              <label>Qty/Day</label>
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={i.quantityPerDay}
                onChange={e => update(i.productId, { quantityPerDay: Number(e.target.value) })}
                className="form-control input-sm"
              />
            </div>
            <div className="row">
              <label>Schedule</label>
              <select
                className="form-control"
                value={i.scheduleType}
                onChange={e => update(i.productId, { scheduleType: e.target.value as any })}
              >
                <option value="DAILY">Daily</option>
                <option value="ALTERNATE">Alternate Days</option>
                <option value="WEEKDAYS">Weekdays</option>
                <option value="WEEKENDS">Weekends</option>
              </select>
            </div>
            <div className="row">
              <label>Plan</label>
              <select
                className="form-control"
                value={i.plan}
                onChange={e => update(i.productId, { plan: e.target.value as any })}
              >
                <option value="one-time">One-time</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="row-between">
              <button className="btn" onClick={() => remove(i.productId)}>Remove</button>
              <strong>₹ {(i.price * Number(i.quantityPerDay)).toFixed(2)}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="row-between section">
        <strong>Subtotal: ₹ {subtotal.toFixed(2)}</strong>
        <button className="btn btn-primary" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
      </div>
    </section>
  );
}
