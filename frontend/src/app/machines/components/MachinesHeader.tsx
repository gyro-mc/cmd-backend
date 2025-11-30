import { ChevronRight, FileText, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import AddMachineModal from "./AddMachineModal" // Adjust path as needed

interface MachinesHeaderProps {
  onAddMachine: (data: any) => void
}

export default function MachinesHeader({ onAddMachine }: MachinesHeaderProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleSubmit = (data: any) => {
    onAddMachine(data)
  }

  return (
    <>
      <div className="mb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">Machines Management</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dialysis Machines Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage all dialysis machines, maintenance schedules, and equipment status
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Export Report</span>
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New Machine</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Machine Modal */}
      <AddMachineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}