function Logo({ className = "", size = "md" }) {
  const sizes = {
    sm: 40,
    md: 60,
    lg: 100
  };

  const height = sizes[size];

  return (
    <img
      src="/logo.png"
      alt="Detection Equipment System Logo"
      height={height}
      className={className}
      style={{ height: `${height}px`, width: 'auto' }}
    />
  );
}

export default Logo;

