import { Monitor, Hash, MapPin, Calendar, Edit, Power } from "lucide-react"
import { AlertCircle } from "lucide-react"
import { useState } from "react"
import DeactivateModal from "./DeactivateModal" 
import AddMachineModal from "./AddMachineModal" 

interface Machine { 
  id: string
  serial: string
  room: string
  status: "in-use" | "available" | "maintenance" | "out-of-service"
  lastMaintenance: string
  nextMaintenance: string
  dueStatus?: "due-soon"
  manufacturer?: string
  model?: string
  notes?: string
}

// Initial machines data
const initialMachines: Machine[] = [
  {
    id: "HD-MAC-101",
    serial: "SN-2024-001",
    room: "Room 3A",
    status: "in-use",
    lastMaintenance: "Oct 15, 2025",
    nextMaintenance: "Jan 15, 2026",
  },
  {
    id: "HD-MAC-102",
    serial: "SN-2024-002",
    room: "Room 3B",
    status: "available",
    lastMaintenance: "Oct 20, 2025",
    nextMaintenance: "Jan 20, 2026",
  },
  {
    id: "HD-MAC-103",
    serial: "SN-2024-003",
    room: "Room 2A",
    status: "maintenance",
    lastMaintenance: "Sep 10, 2025",
    nextMaintenance: "Dec 10, 2025",
    dueStatus: "due-soon",
  },
  {
    id: "HD-MAC-104",
    serial: "SN-2024-004",
    room: "Room 2B",
    status: "available",
    lastMaintenance: "Nov 1, 2025",
    nextMaintenance: "Feb 1, 2026",
  },
  {
    id: "HD-MAC-105",
    serial: "SN-2024-005",
    room: "Room 1C",
    status: "in-use",
    lastMaintenance: "Oct 25, 2025",
    nextMaintenance: "Jan 25, 2026",
  },
  {
    id: "HD-MAC-106",
    serial: "SN-2024-006",
    room: "Room 1A",
    status: "out-of-service",
    lastMaintenance: "Aug 15, 2025",
    nextMaintenance: "Nov 15, 2025",
    dueStatus: "due-soon",
  },
  {
    id: "HD-MAC-107",
    serial: "SN-2024-007",
    room: "Room 1B",
    status: "available",
    lastMaintenance: "Nov 5, 2025",
    nextMaintenance: "Feb 5, 2026",
  },
  {
    id: "HD-MAC-108",
    serial: "SN-2024-008",
    room: "Room 1A",
    status: "in-use",
    lastMaintenance: "Oct 10, 2025",
    nextMaintenance: "Jan 10, 2026",
  },
]

const statusConfig = {
  "in-use": {
    label: "In Use",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    dotColor: "bg-blue-600",
  },
  available: {
    label: "Available",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    dotColor: "bg-green-600",
  },
  maintenance: {
    label: "Maintenance",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    dotColor: "bg-yellow-600",
  },
  "out-of-service": {
    label: "Out of Service",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    dotColor: "bg-red-600",
  },
}

interface MachinesTableProps {
  searchTerm: string
  selectedRoom: string
  selectedStatus: string
  onAddMachine: (data: any) => void
}

export default function MachinesTable({
  searchTerm,
  selectedRoom,
  selectedStatus,
  onAddMachine,
}: MachinesTableProps) {
  const [machines, setMachines] = useState<Machine[]>(initialMachines)
  const [deactivateModal, setDeactivateModal] = useState<{isOpen: boolean; machineId: string}>({
    isOpen: false,
    machineId: ""
  })
  const [editModal, setEditModal] = useState<{isOpen: boolean; machineData: Machine | null}>({
    isOpen: false,
    machineData: null
  })

  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      machine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.room.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRoom = selectedRoom === "all" || machine.room.includes(selectedRoom)
    const matchesStatus = selectedStatus === "all" || machine.status === selectedStatus

    return matchesSearch && matchesRoom && matchesStatus
  })

  const handleDeactivate = (machineId: string) => {
    setDeactivateModal({ isOpen: true, machineId })
  }

  const handleConfirmDeactivate = () => {
    // Update the machine status to "out-of-service"
    setMachines(prevMachines => 
      prevMachines.map(machine => 
        machine.id === deactivateModal.machineId 
          ? { ...machine, status: "out-of-service" as const }
          : machine
      )
    )
    setDeactivateModal({ isOpen: false, machineId: "" })
  }

  const handleEdit = (machine: Machine) => {
    setEditModal({ isOpen: true, machineData: machine })
  }

  const handleSubmitEdit = (data: any) => {
    // Update the machine with the new data
    setMachines(prevMachines =>
      prevMachines.map(machine =>
        machine.id === data.id
          ? {
              ...machine,
              id: data.id as string,
              serial: data.serial as string,
              room: data.room as string,
              status: data.status as "in-use" | "available" | "maintenance" | "out-of-service",
              lastMaintenance: data.lastMaintenance as string,
              nextMaintenance: data.nextMaintenance as string,
              manufacturer: data.manufacturer as string,
              model: data.model as string,
              notes: data.notes as string,
            }
          : machine
      )
    )
  }

  const handleAddMachine = (data: any) => {
    // Generate a new machine ID based on the highest existing ID
    const highestId = Math.max(...machines.map(m => parseInt(m.id.split('-').pop() || '0')))
    const newId = `HD-MAC-${(highestId + 1).toString().padStart(3, '0')}`
    
    const newMachine: Machine = {
      id: data.machineId as string || newId,
      serial: data.serialNumber as string,
      room: data.room as string,
      status: data.status as "in-use" | "available" | "maintenance" | "out-of-service",
      lastMaintenance: data.lastMaintenance as string,
      nextMaintenance: data.nextMaintenance as string,
      manufacturer: data.manufacturer as string,
      model: data.model as string,
      notes: data.notes as string,
    }

    setMachines(prevMachines => [...prevMachines, newMachine])
    onAddMachine(newMachine)
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Machines List ({filteredMachines.length})
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Monitor className="w-4 h-4" />
                    Machine ID
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Hash className="w-4 h-4" />
                    Serial Number
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <MapPin className="w-4 h-4" />
                    Room
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4" />
                    Last Maintenance
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4" />
                    Next Maintenance
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMachines.map((machine) => {
                const status = statusConfig[machine.status]
                return (
                  <tr key={machine.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status.dotColor}`}></div>
                        <span className="font-semibold text-gray-900">{machine.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{machine.serial}</td>
                    <td className="px-6 py-4 text-gray-900 text-sm">{machine.room}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 ${status.bgColor} ${status.textColor} text-xs font-medium px-2.5 py-1 rounded-full`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}></div>
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {machine.lastMaintenance}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">{machine.nextMaintenance}</span>
                        {machine.dueStatus === "due-soon" && (
                          <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            Due Soon
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(machine)}
                          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeactivate(machine.id)}
                          className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          <Power className="w-4 h-4" />
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deactivate Modal */}
      <DeactivateModal
        isOpen={deactivateModal.isOpen}
        onClose={() => setDeactivateModal({ isOpen: false, machineId: "" })}
        machineId={deactivateModal.machineId}
        onConfirm={handleConfirmDeactivate}
      />

      {/* Edit Modal */}
      <AddMachineModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, machineData: null })}
        editData={editModal.machineData ? {
          id: editModal.machineData.id,
          serial: editModal.machineData.serial,
          room: editModal.machineData.room,
          status: editModal.machineData.status,
          manufacturer: editModal.machineData.manufacturer,
          model: editModal.machineData.model,
          lastMaintenance: editModal.machineData.lastMaintenance,
          nextMaintenance: editModal.machineData.nextMaintenance,
          notes: editModal.machineData.notes
        } : null}
        onSubmit={handleSubmitEdit}
      />
    </>
  )
}