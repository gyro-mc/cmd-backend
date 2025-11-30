// frontend/src/app/prescriptions/components/PatientInfoSection.tsx
import React from 'react';

interface PatientInfo {
  name: string;
  id: string;
  age: string;
  gender: string;
}

interface PatientInfoSectionProps {
  patientInfo?: PatientInfo;
}

const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({ 
  patientInfo = {
    name: 'John Michael Doe',
    id: 'HD-2024-1234',
    age: '58',
    gender: 'Male'
  }
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-teal-600 text-white px-6 py-4">
        <h2 className="text-lg font-semibold">Patient Information</h2>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name
            </label>
            <input
              type="text"
              value={patientInfo.name}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient ID
            </label>
            <input
              type="text"
              value={patientInfo.id}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="text"
              value={patientInfo.age}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <input
              type="text"
              value={patientInfo.gender}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoSection;