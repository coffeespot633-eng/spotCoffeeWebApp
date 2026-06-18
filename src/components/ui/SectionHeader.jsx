export default function SectionHeader({
  subtitle,
  title,
}) {
  return (
    <div className="mb-6">
      <p className="text-sm font-extrabold uppercase tracking-widest text-[var(--color-coffee-500)]">
        {subtitle}
      </p>

      <h2 className="text-3xl font-black text-[var(--color-coffee-800)]">
        {title}
      </h2>
    </div>
  );
}