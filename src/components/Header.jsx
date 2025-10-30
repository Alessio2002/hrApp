export default function Header({ header }) {
  const text = header ?? "";
  const lower = text.toLowerCase();
  const first = lower.startsWith("hr") ? text.slice(0, 2) : text.slice(0, 1);
  const rest = text.slice(first.length);

  return (
    <header className="site-header" aria-label="App header">
      <h1 className="brand">
        <span className="brand-hr">{first}</span>
        <span className="brand-app">{rest}</span>
      </h1>
    </header>
  );
}
