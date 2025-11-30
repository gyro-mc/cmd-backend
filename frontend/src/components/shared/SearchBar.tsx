import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  icon?: ReactNode;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "flex-1 max-w-md",
  icon = <Search className="w-5 h-5" />,
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-gray-50 border-gray-200"
      />
    </div>
  );
}
