export default function ExitPage({ onEnter }) {
  return (
    <div className="sim-page success">
      <div className="badge">✕</div>
      <h2>Exited</h2>
      <p className="muted">You left the store.</p>
      <button className="primary wide" onClick={onEnter}>
        Back to home
      </button>
    </div>
  );
}
