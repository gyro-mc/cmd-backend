import { AlertCircle } from "lucide-react"

interface DeactivateModalProps {
  isOpen: boolean
  onClose: () => void
  machineId: string
  onConfirm: () => void
}

export default function DeactivateModal({ isOpen, onClose, machineId, onConfirm }: DeactivateModalProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Content */}
        <div className="p-6">
          {/* Icon & Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Deactivate Machine
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Are you sure you want to deactivate machine <span className="font-semibold text-gray-900">{machineId}</span>? This will mark it as "Out of Service" and it won't be available for dialysis sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  )
}