// frontend/src/app/prescriptions/components/PrescriptionsHeader.tsx
import React from 'react';
import { X, Save, Printer, FileText } from 'lucide-react';
import type { Medication } from './PrescriptionsLayout';

interface PrescriptionsHeaderProps {
  medications: Medication[];
  onClearAll: () => void;
  onSave: () => void;
  onPrintRequestForm: () => void;
  onPrintPrescription: () => void;
}

const PrescriptionsHeader: React.FC<PrescriptionsHeaderProps> = ({
  medications,
  onClearAll,
  onSave,
  onPrintRequestForm,
  onPrintPrescription
}) => {
  const hasContent = medications.some(
    med => med.name || med.dosage || med.frequency || med.duration || med.notes
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">Prescription</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Medical Prescription / وصفة طبية
            </h1>
            <p className="text-gray-600 mt-1">Create and manage patient prescriptions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClearAll}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
          >
            <X size={18} />
            Clear All
          </button>
          
          <button
            onClick={onSave}
            disabled={!hasContent}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            Save
          </button>
          
          <button
            onClick={onPrintRequestForm}
            disabled={!hasContent}
            className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 border border-teal-600 rounded-lg hover:bg-teal-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={18} />
            Print Request Form
          </button>
          
          <button
            onClick={onPrintPrescription}
            disabled={!hasContent}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer size={18} />
            Print Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionsHeader;