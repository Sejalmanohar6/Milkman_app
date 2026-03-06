export default function Home() {
  return (
    <section className="stack" style={{ textAlign: 'left' }}>
      <div className="hero">
        <div className="stack">
          <h1 className="title">Fresh dairy, delivered on your schedule</h1>
          <p className="lead">
            Flexible subscriptions for milk and dairy. Choose daily, alternate days, weekdays or weekends.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="/products">Browse Products</a>
            <a className="btn" href="/cart">View Cart</a>
          </div>
          <div className="row" style={{ marginTop: '.5rem', flexWrap: 'wrap', gap: '.5rem' }}>
            <span className="badge badge-muted">Free delivery over ₹299</span>
            <span className="badge badge-muted">No long-term contracts</span>
            <span className="badge badge-muted">Pause anytime</span>
          </div>
        </div>
        <div className="card stack">
          <div className="row-between">
            <strong>Why Milkman?</strong>
            <span className="badge badge-info">New</span>
          </div>
          <div className="muted">Set a plan once, and we handle the rest.</div>
          <ul className="list" style={{ marginTop: '.5rem' }}>
            <li>Reliable delivery windows</li>
            <li>Transparent pricing per unit</li>
            <li>Pause or change anytime</li>
          </ul>
        </div>
      </div>

      <div className="cards-3">
        <div className="card stack">
          <strong>Daily Freshness</strong>
          <div className="muted">Sourced daily so you always get the best.</div>
        </div>
        <div className="card stack">
          <strong>Flexible Schedules</strong>
          <div className="muted">Daily, alternate, weekdays, or weekends.</div>
        </div>
        <div className="card stack">
          <strong>Simple Billing</strong>
          <div className="muted">Clear line items and totals every cycle.</div>
        </div>
      </div>

      <div className="stack" style={{ marginTop: '1rem' }}>
        <h2 className="title" style={{ fontSize: '1.4rem' }}>Featured</h2>
        <div className="cards-3">
          <div className="card stack">
            <strong>Buffalo Milk</strong>
            <div className="row-between">
              <span className="muted">₹ 60 / liter</span>
              <a className="btn btn-primary" href="/products">Add</a>
            </div>
          </div>
          <div className="card stack">
            <strong>Cow Milk</strong>
            <div className="row-between">
              <span className="muted">₹ 50 / liter</span>
              <a className="btn btn-primary" href="/products">Add</a>
            </div>
          </div>
          <div className="card stack">
            <strong>Paneer</strong>
            <div className="row-between">
              <span className="muted">₹ 300 / kg</span>
              <a className="btn btn-primary" href="/products">Add</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
