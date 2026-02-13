import watchImage from "../../../../asset/watch_image.png";

export default function CartPage({ onNavigate, loading }) {
  return (
    <div className="sim-page">
      <h2>購入手続き</h2>

      <div className="card row">
        <div className="thumb">
          <img src={watchImage} alt="ミニマルウォッチ" />
        </div>
        <div className="card-body">
          <div className="card-title">ミニマルウォッチ</div>
          <div className="muted">ブラックレザー · 40mm</div>
          <div className="price">$129.00</div>
        </div>
        <div className="qty">1×</div>
      </div>

      <div className="stack">
        <div className="line">
          <span className="muted">小計</span>
          <span>$129.00</span>
        </div>
        <div className="line">
          <span className="muted">送料</span>
          <span>$0.00</span>
        </div>
        <div className="line total">
          <span>合計</span>
          <span>$129.00</span>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={() => onNavigate("success")}
        className="primary wide"
      >
        {loading ? "処理中…" : "注文を確定"}
      </button>

      <button
        className="ghost"
        disabled={loading}
        onClick={() => onNavigate("product")}
      >
        ← 買い物に戻る
      </button>
    </div>
  );
}
