export default function SplitLayout({ left, right }) {
  return (
    <div className="split-layout">
      <section className="split-left">
        {left}
      </section>

      <section className="split-right">
        {right}
      </section>
    </div>
  );
}