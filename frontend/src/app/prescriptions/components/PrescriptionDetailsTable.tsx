// frontend/src/app/prescriptions/components/PrescriptionDetailsTable.tsx
import React from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import type { Medication } from './PrescriptionsLayout';

interface PrescriptionDetailsTableProps {
  medications: Medication[];
  onAddMedication: () => void;
  onRemoveMedication: (id: string) => void;
  onUpdateMedication: (id: string, field: keyof Medication, value: string) => void;
  onReuseLastPrescription: () => void;
}

const frequencyOptions = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'As needed',
  'Before meals',
  'After meals',
  'At bedtime'
];

const PrescriptionDetailsTable: React.FC<PrescriptionDetailsTableProps> = ({
  medications,
  onAddMedication,
  onRemoveMedication,
  onUpdateMedication,
  onReuseLastPrescription
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Prescription Details</h2>
        <button
          onClick={onReuseLastPrescription}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RotateCcw size={16} />
          Reuse Last Prescription
        </button>
      </div>

      {/* Table */}
      <div className="p-6 overflow-x-auto">
        <div className="min-w-full">
          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-4 mb-4 pb-3 border-b border-gray-200">
            <div className="col-span-3">
              <label className="block text-sm font-semibold text-gray-700">Medication</label>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Dosage</label>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Frequency</label>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Duration</label>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Notes</label>
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Rows */}
          <div className="space-y-4">
            {medications.map((medication) => (
              <div key={medication.id} className="grid grid-cols-12 gap-4 items-start">
                {/* Medication Name */}
                <div className="col-span-3">
                  <input
                    type="text"
                    value={medication.name}
                    onChange={(e) => onUpdateMedication(medication.id, 'name', e.target.value)}
                    placeholder="Start typing medication name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Dosage */}
                <div className="col-span-2">
                  <input
                    type="text"
                    value={medication.dosage}
                    onChange={(e) => onUpdateMedication(medication.id, 'dosage', e.target.value)}
                    placeholder="e.g., 5mg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Frequency */}
                <div className="col-span-2">
                  <select
                    value={medication.frequency}
                    onChange={(e) => onUpdateMedication(medication.id, 'frequency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  >
                    <option value="">Select frequency</option>
                    {frequencyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div className="col-span-2">
                  <input
                    type="text"
                    value={medication.duration}
                    onChange={(e) => onUpdateMedication(medication.id, 'duration', e.target.value)}
                    placeholder="e.g., 30 days"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Notes */}
                <div className="col-span-2">
                  <input
                    type="text"
                    value={medication.notes}
                    onChange={(e) => onUpdateMedication(medication.id, 'notes', e.target.value)}
                    placeholder="Additional notes..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Delete Button */}
                <div className="col-span-1 flex items-center justify-center">
                  <button
                    onClick={() => onRemoveMedication(medication.id)}
                    disabled={medications.length === 1}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove medication"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Medication Button */}
          <button
            onClick={onAddMedication}
            className="flex items-center gap-2 px-4 py-2 mt-6 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-teal-200"
          >
            <Plus size={20} />
            Add New Medication
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailsTable;