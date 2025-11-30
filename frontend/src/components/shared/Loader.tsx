import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Loader({ size = "md", className = "" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Loader2
        className={`${sizeClasses[size]} border-4 border-[#1C8CA8] border-t-transparent rounded-full animate-spin ${className}`}
      />
    </div>
  );
}
