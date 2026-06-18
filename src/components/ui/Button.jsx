export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}) {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary: "bg-[var(--color-coffee-700)] text-white shadow-sm hover:bg-[var(--color-coffee-800)]",
    secondary: "bg-[var(--color-cream-500)] text-[var(--color-coffee-700)] hover:bg-[var(--color-cream-600)]",
    outline: "border border-[var(--color-coffee-200)] bg-white text-[var(--color-coffee-700)] hover:bg-[var(--color-coffee-50)]",
    ghost: "text-[var(--color-coffee-700)] hover:bg-[var(--color-coffee-100)]",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "min-h-9 px-3 text-xs",
    md: "min-h-11 px-4 text-sm",
    lg: "min-h-12 px-5 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
