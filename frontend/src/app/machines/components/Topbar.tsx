import { Search, Bell } from "lucide-react"

interface TopBarProps {
  searchPlaceholder?: string
}

export default function TopBar({ searchPlaceholder = "Search by patient name or ID..." }: TopBarProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">Dr. Sarah Johnson</p>
              <p className="text-xs text-gray-500">Nephrologist</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="Dr. Sarah Johnson"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}