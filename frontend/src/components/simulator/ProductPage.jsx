import watchImage from "../../../../asset/watch_image.png";

export default function ProductPage({ onNavigate, loading }) {
  return (
    <div className="sim-page">
      <div className="media-box">
        <img src={watchImage} alt="ミニマルウォッチ" />
      </div>

      <div className="stack">
        <h2>ミニマルウォッチ</h2>
        <p className="muted">
          サファイアガラス、上質レザー、日本製ムーブメントにこだわった時計です。
        </p>
        <div className="price-row">
          <div>
            <p className="muted small">価格</p>
            <div className="price">$129.00</div>
          </div>
          <button
            disabled={loading} onClick={() => onNavigate("cart")} className="primary wide"
          >
            {loading ? "追加中…" : "カートに入れる"}
          </button>
        </div>

        <div className="spec-grid">
          <div><span className="label">ストラップ</span> レザー</div>
          <div><span className="label">ガラス</span> サファイア</div>
          <div><span className="label">防水</span> 5 ATM</div>
          <div><span className="label">保証</span> 2年</div>
        </div>
      </div>
    </div>
  );
}
