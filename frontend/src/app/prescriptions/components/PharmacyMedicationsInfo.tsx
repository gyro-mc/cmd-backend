// frontend/src/app/prescriptions/components/PharmacyMedicationsInfo.tsx
import React from 'react';
import { Pill } from 'lucide-react';

const PharmacyMedicationsInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Pill className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Pharmacy Medications
          </h3>
          <p className="text-blue-800 leading-relaxed">
            These medications will be purchased from a pharmacy. Common categories include blood 
            pressure medications, diabetes pills, phosphate binders, vitamin D supplements, painkillers, 
            and antibiotics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PharmacyMedicationsInfo;