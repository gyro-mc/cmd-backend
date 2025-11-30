import { Search, Filter } from "lucide-react"

interface MachinesFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedRoom: string
  setSelectedRoom: (room: string) => void
  selectedStatus: string
  setSelectedStatus: (status: string) => void
}

export default function MachinesFilters({
  searchTerm,
  setSearchTerm,
  selectedRoom,
  setSelectedRoom,
  selectedStatus,
  setSelectedStatus,
}: MachinesFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Machine ID, Serial Number, or Room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Room Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-w-[150px]"
          >
            <option value="all">All Rooms</option>
            <option value="1A">Room 1A</option>
            <option value="1B">Room 1B</option>
            <option value="1C">Room 1C</option>
            <option value="2A">Room 2A</option>
            <option value="2B">Room 2B</option>
            <option value="3A">Room 3A</option>
            <option value="3B">Room 3B</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-w-[150px]"
          >
            <option value="all">All Statuses</option>
            <option value="in-use">In Use</option>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="out-of-service">Out of Service</option>
          </select>
        </div>
      </div>
    </div>
  )
}