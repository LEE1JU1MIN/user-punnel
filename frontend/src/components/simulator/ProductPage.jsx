export default function ProductPage({ onNavigate, loading }) {
  return (
    <div className="sim-page">
      <div className="media-box" />

      <div className="stack">
        <h2>Minimalist Watch</h2>
        <p className="muted">
          Focused on the essentials: sapphire glass, premium leather strap, Japanese movement.
        </p>
        <div className="price-row">
          <div>
            <p className="muted small">Price</p>
            <div className="price">$129.00</div>
          </div>
          <button
            disabled={loading} onClick={() => onNavigate("cart")} className="primary wide"
          >
            {loading ? "Adding…" : "Add to cart"}
          </button>
        </div>

        <div className="spec-grid">
          <div><span className="label">Strap</span> Leather</div>
          <div><span className="label">Glass</span> Sapphire</div>
          <div><span className="label">Water</span> 5 ATM</div>
          <div><span className="label">Warranty</span> 2 yrs</div>
        </div>
      </div>
    </div>
  );
}
