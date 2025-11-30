// frontend/src/app/lab-request/components/LabRequestHeader.tsx
import React from 'react';
import { X, Save, Printer } from 'lucide-react';

interface LabRequestHeaderProps {
  selectedTests: number[];
  otherTests: string;
  onSave: () => void;
  onCancel: () => void;
  onPrint: () => void;
}

const LabRequestHeader: React.FC<LabRequestHeaderProps> = ({ 
  selectedTests, 
  otherTests,
  onSave,
  onCancel,
  onPrint 
}) => {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">Lab Request</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lab Request</h1>
          <p className="text-gray-600 mt-1">Generate laboratory test requests for external laboratories</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
          >
            <X size={18} />
            Cancel
          </button>
          
          <button
            onClick={onSave}
            disabled={selectedTests.length === 0 && !otherTests.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            Save
          </button>
          
          <button
            onClick={onPrint}
            disabled={selectedTests.length === 0 && !otherTests.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer size={18} />
            Print Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabRequestHeader;