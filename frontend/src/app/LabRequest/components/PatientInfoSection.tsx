// frontend/src/app/lab-request/components/PatientInfoSection.tsx
import React from 'react';

interface PatientInfo {
  name: string;
  id: string;
  age: string;
  gender: string;
  requestDate: string;
  doctor: string;
}

interface PatientInfoSectionProps {
  patientInfo?: PatientInfo;
}

const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({ 
  patientInfo = {
    name: 'John Michael Doe',
    id: 'HD-2024-1234',
    age: '58',
    gender: 'Male',
    requestDate: 'November 30, 2025',
    doctor: 'Dr. Sarah Johnson'
  }
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-teal-600 text-white px-6 py-4">
        <h2 className="text-lg font-semibold">Patient Information</h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Row 1: Name and ID */}
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
        </div>

        {/* Row 2: Age, Gender, Request Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Date
            </label>
            <input
              type="text"
              value={patientInfo.requestDate}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Row 3: Doctor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Doctor
          </label>
          <input
            type="text"
            value={patientInfo.doctor}
            readOnly
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default PatientInfoSection;