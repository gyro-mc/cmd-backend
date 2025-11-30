import { useState } from "react"
import Sidebar from '../../dashboard/components/Sidebar';
import TopBar from "./Topbar"
import MachinesHeader from "./MachinesHeader"
import MachinesStats from "./MachinesStats"
import MachinesFilters from "./MachinesFilters"
import MachinesTable from "./MachinesTable"

export default function MachinesLayout() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoom, setSelectedRoom] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Add this function to handle new machine additions
  const handleAddMachine = (data: any) => {
    console.log('New machine added:', data)
    // You can add additional logic here like API calls, notifications, etc.
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar searchPlaceholder="Search by patient name or ID..." />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Page Header */}
            <MachinesHeader onAddMachine={handleAddMachine} />

            {/* Stats Cards */}
            <MachinesStats />

            {/* Filters */}
            <MachinesFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />

            {/* Table */}
            <MachinesTable
              searchTerm={searchTerm}
              selectedRoom={selectedRoom}
              selectedStatus={selectedStatus}
              onAddMachine={handleAddMachine}
            />
          </div>
        </main>
      </div>
    </div>
  )
}