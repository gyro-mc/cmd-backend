// frontend/src/app/roles-permissions/components/SecurityWarning.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SecurityWarning: React.FC = () => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-900 font-semibold mb-1">Security Warning:</h3>
          <p className="text-red-800 text-sm">
            Changing permissions affects system security and user access. Please ensure you understand 
            the implications before modifying role permissions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityWarning;