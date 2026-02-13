export default function HomePage({ onNavigate, loading }) {
  return (
    <div className="sim-page">
      <div className="hero">
        <div>
          <p className="eyebrow">新着</p>
          <h2>ミニマルウォッチ</h2>
          <p className="muted">上質レザーとサファイアガラス。即日発送。</p>
          <button disabled={loading} onClick={() => onNavigate("product")} className="primary"
          > 詳細を見る </button>
        </div>
        <div className="hero-blob" />
      </div>

      <div className="list">
        <h3>人気商品</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" onClick={() => onNavigate("product")}>
            <div className="thumb" />
            <div className="card-body">
              <div className="card-title">ミニマルウォッチ #{i}</div>
              <div className="muted">ブラックレザー · 40mm</div>
              <div className="price">$129</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
