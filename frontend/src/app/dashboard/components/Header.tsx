"use client"

import { Search, Bell } from "lucide-react"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="border-b border-border bg-white">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notification Bell */}
          <button className="relative p-2 text-muted-foreground hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              AD
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
