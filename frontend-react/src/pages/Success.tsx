import { Link, useLocation } from 'react-router-dom';

export default function Success() {
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const total = params.get('total');
  return (
    <section>
      <h1 className="title">Payment Successful</h1>
      <p className="lead">Thank you! Your subscriptions are active and your payment has been recorded.</p>
      {total && <p><strong>Total:</strong> ₹ {total}</p>}
      <div className="cta">
        <Link className="btn btn-primary" to="/products">Continue Shopping</Link>
      </div>
    </section>
  );
}
