export default function AppHeader({ title, onBack, onExit }) {
  return (
    <header className="app-header">
      {onBack && (
        <button className="back-btn" onClick={onBack}>
          ←
        </button>
      )}
      <h1>{title}</h1>
      <div className="spacer" />
      {onExit && (
        <button className="exit-btn" onClick={onExit}>
          ×
        </button>
      )}
    </header>
  );
}
