export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  error,
  ...props
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && <label className="text-sm font-bold text-[var(--color-coffee-700)]">{label}</label>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`min-h-11 rounded-2xl border bg-white px-4 py-3 text-sm text-[var(--color-coffee-800)] outline-none transition placeholder:text-stone-400 focus:border-[var(--color-coffee-500)] focus:ring-4 focus:ring-[rgba(143,90,47,0.12)] ${
          error ? "border-red-500" : "border-[var(--color-coffee-200)]"
        }`}
        {...props}
      />
      {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
    </div>
  );
}
