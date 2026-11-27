const variants = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus-visible:outline-primary-600",
  secondary:
    "border border-primary-200 bg-white text-primary-700 hover:bg-primary-50 focus-visible:outline-primary-600",
  ghost:
    "text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400",
};

function Button({
  as: Component = "button",
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) {
  const buttonOnlyProps =
    Component === "button" ? { type, disabled: disabled || loading } : {};

  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...buttonOnlyProps}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </Component>
  );
}

export default Button;