export default function HomePage({ onNavigate, loading }) {
  return (
    <div className="sim-page">
      <div className="hero">
        <div>
          <p className="eyebrow">New Arrival</p>
          <h2>Minimalist Watch</h2>
          <p className="muted">Premium leather, sapphire glass. Ships today.</p>
          <button disabled={loading} onClick={() => onNavigate("product")} className="primary"
          > View details </button>
        </div>
        <div className="hero-blob" />
      </div>

      <div className="list">
        <h3>Popular picks</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" onClick={() => onNavigate("product")}>
            <div className="thumb" />
            <div className="card-body">
              <div className="card-title">Minimal Watch #{i}</div>
              <div className="muted">Black leather · 40mm</div>
              <div className="price">$129</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
