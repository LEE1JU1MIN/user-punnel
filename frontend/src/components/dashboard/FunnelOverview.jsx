import FunnelRow from "./FunnelRow";

export default function FunnelOverview({ metrics, current }) {
  return (
    <div className="funnel-overview">
      <FunnelRow
        step="1. Home"
        conversion={100}
        systemTime={metrics.home.system}
        userTime={metrics.home.user}
        active={current === "home"}
      />

      <FunnelRow
        step="2. Product"
        conversion={68}
        systemTime={metrics.product.system}
        userTime={metrics.product.user}
        active={current === "product"}
      />

      <FunnelRow
        step="3. Cart"
        conversion={42}
        systemTime={metrics.cart.system}
        userTime={metrics.cart.user}
        bottleneck={metrics.cart.system > 1000}
        active={current === "cart"}
      />

      <FunnelRow
        step="4. Conversion"
        conversion={25}
        systemTime={200}
        userTime={0}
        active={current === "success"}
      />
    </div>
  );
}