import type { ReactNode } from "react";

interface FormCardProps {
  title: string;
  children: ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
}

export function FormCard({
  title,
  children,
  gradientFrom = "#1c8ca8",
  gradientTo = "#157a93",
}: FormCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Card Header with Gradient */}
      <div
        className="h-12 flex items-center px-6"
        style={{
          background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        <h2 className="text-base text-white font-normal">{title}</h2>
      </div>

      {/* Card Content */}
      <div className="p-6">{children}</div>
    </div>
  );
}
