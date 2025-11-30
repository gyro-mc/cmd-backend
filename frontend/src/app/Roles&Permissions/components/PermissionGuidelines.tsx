// frontend/src/app/roles-permissions/components/PermissionGuidelines.tsx
import React from 'react';
import { Info } from 'lucide-react';

const PermissionGuidelines: React.FC = () => {
  const guidelines = [
    {
      role: 'Administrator:',
      description: 'Has full access to all modules. Can view, edit, and delete all data. Can manage users and permissions.'
    },
    {
      role: 'Doctor:',
      description: 'Can access patient records, create prescriptions, view lab results, and manage appointments for their own patients.'
    },
    {
      role: 'Nurse:',
      description: 'Can manage dialysis sessions, operate machines, and update patient care records. No access to billing or prescriptions.'
    },
    {
      role: 'Receptionist:',
      description: 'Can register new patients, schedule appointments, and manage billing. Limited access to medical records.'
    }
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <h3 className="text-lg font-semibold text-blue-900">Permission Guidelines</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guidelines.map((guideline, index) => (
          <div key={index}>
            <h4 className="font-semibold text-blue-900 mb-2">{guideline.role}</h4>
            <p className="text-blue-800 text-sm leading-relaxed">{guideline.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionGuidelines;