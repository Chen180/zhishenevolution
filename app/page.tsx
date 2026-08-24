const stack = [
  ["Runtime", "Node.js 22"],
  ["Framework", "Next.js 16 / React 19"],
  ["Language", "TypeScript strict"],
  ["Delivery", "Docker Compose / Caddy"],
];

const boundaries = [
  ["Presentation", "app / components"],
  ["Application", "lib/application"],
  ["Domain", "lib/domain"],
  ["Infrastructure", "lib/infrastructure"],
];

const checks = [
  ["Lint", "ESLint 9"],
  ["Types", "TypeScript"],
  ["Tests", "Vitest"],
  ["Build", "Next.js standalone"],
];

export default function Home() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            Z
          </span>
          <span>Project Template</span>
        </div>
        <div className="status">
          <span className="status-dot" aria-hidden="true" />
          Baseline ready
        </div>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">APPLICATION BASELINE</p>
        <h1 id="page-title">项目骨架已就绪</h1>
        <p className="summary">
          从这里开始实现业务模块，保留既定的工程边界、质量门槛和生产部署契约。
        </p>
      </section>

      <section className="metrics" aria-label="技术栈">
        {stack.map(([label, value]) => (
          <div className="metric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section className="workspace">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MODULES</p>
              <h2>代码边界</h2>
            </div>
            <span className="section-index">01</span>
          </div>
          <div className="rows">
            {boundaries.map(([label, value]) => (
              <div className="row" key={label}>
                <span>{label}</span>
                <code>{value}</code>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">QUALITY GATE</p>
              <h2>交付检查</h2>
            </div>
            <span className="section-index">02</span>
          </div>
          <div className="rows">
            {checks.map(([label, value]) => (
              <div className="row" key={label}>
                <span>{label}</span>
                <strong className="check-value">{value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer>
        <span>Health endpoint</span>
        <code>/api/health</code>
      </footer>
    </main>
  );
}
