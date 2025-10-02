export default function LoadingSpinner({ size = "md", color = "rose", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const colorClasses = {
    rose: "border-[color:var(--rose)] border-t-transparent",
    slate: "border-slate-400 border-t-transparent",
    white: "border-white border-t-transparent"
  };

  return (
    <div className={`animate-spin rounded-full border-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`} />
  );
}

// Centered loading state component
export function LoadingState({ message = "Loading...", size = "lg" }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-600">
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}

// Inline loading spinner
export function InlineSpinner({ size = "sm", color = "rose", className = "" }) {
  return <LoadingSpinner size={size} color={color} className={`inline-block ${className}`} />;
}