export default function CartPage({ onNavigate, loading }) {
  return (
    <div className="sim-page">
      <h2>Checkout</h2>

      <div className="card row">
        <div className="thumb" />
        <div className="card-body">
          <div className="card-title">Minimalist Watch</div>
          <div className="muted">Black leather · 40mm</div>
          <div className="price">$129.00</div>
        </div>
        <div className="qty">1×</div>
      </div>

      <div className="stack">
        <div className="line">
          <span className="muted">Subtotal</span>
          <span>$129.00</span>
        </div>
        <div className="line">
          <span className="muted">Shipping</span>
          <span>$0.00</span>
        </div>
        <div className="line total">
          <span>Total</span>
          <span>$129.00</span>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={() => onNavigate("success")}
        className="primary wide"
      >
        {loading ? "Processing…" : "Place order"}
      </button>

      <button
        className="ghost"
        disabled={loading}
        onClick={() => onNavigate("product")}
      >
        ← Continue shopping
      </button>
    </div>
  );
}
