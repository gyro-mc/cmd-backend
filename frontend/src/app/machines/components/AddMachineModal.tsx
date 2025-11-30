import { X, Monitor, Hash, MapPin, Calendar, AlertCircle, FileText } from "lucide-react"

interface AddMachineModalProps {
  isOpen: boolean
  onClose: () => void
  editData?: {
    id: string
    serial: string
    room: string
    status: string
    manufacturer?: string
    model?: string
    lastMaintenance: string
    nextMaintenance: string
    notes?: string
  } | null
  onSubmit: (data: any) => void
}

export default function AddMachineModal({ isOpen, onClose, editData, onSubmit }: AddMachineModalProps) {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      id: formData.get("machineId"),
      serial: formData.get("serialNumber"),
      room: formData.get("room"),
      status: formData.get("status"),
      manufacturer: formData.get("manufacturer"),
      model: formData.get("model"),
      lastMaintenance: formData.get("lastMaintenance"),
      nextMaintenance: formData.get("nextMaintenance"),
      notes: formData.get("notes"),
    }
    onSubmit(data)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {editData ? "Edit Machine" : "Add New Machine"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Machine ID */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Monitor className="w-4 h-4 text-teal-600" />
                  Machine ID *
                </label>
                <input
                  type="text"
                  name="machineId"
                  defaultValue={editData?.id}
                  placeholder="e.g., HD-MAC-101"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              {/* Serial Number */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 text-teal-600" />
                  Serial Number *
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  defaultValue={editData?.serial}
                  placeholder="e.g., SN-2024-001"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              {/* Room */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  Room *
                </label>
                <select
                  name="room"
                  defaultValue={editData?.room}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  <option value="">Select room</option>
                  <option value="Room 1A">Room 1A</option>
                  <option value="Room 1B">Room 1B</option>
                  <option value="Room 1C">Room 1C</option>
                  <option value="Room 2A">Room 2A</option>
                  <option value="Room 2B">Room 2B</option>
                  <option value="Room 3A">Room 3A</option>
                  <option value="Room 3B">Room 3B</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={editData?.status || "available"}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  <option value="available">Available</option>
                  <option value="in-use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="out-of-service">Out of Service</option>
                </select>
              </div>

              {/* Manufacturer */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  defaultValue={editData?.manufacturer}
                  placeholder="e.g., Fresenius Medical Care"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              {/* Model */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  defaultValue={editData?.model}
                  placeholder="e.g., 5008S"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Maintenance Schedule */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Last Maintenance Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Last Maintenance Date *
                </label>
                <input
                  type="date"
                  name="lastMaintenance"
                  defaultValue={editData?.lastMaintenance}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              {/* Next Maintenance Due */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Next Maintenance Due *
                </label>
                <input
                  type="date"
                  name="nextMaintenance"
                  defaultValue={editData?.nextMaintenance}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-teal-600" />
              Additional Notes
            </label>
            <textarea
              name="notes"
              defaultValue={editData?.notes}
              rows={4}
              placeholder="Enter any additional notes about this machine..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {editData ? "Update Machine" : "Add Machine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}