// frontend/src/app/roles-permissions/components/RolesPermissionsHeader.tsx
import React from 'react';
import { RotateCcw, Save } from 'lucide-react';

interface RolesPermissionsHeaderProps {
  hasUnsavedChanges: boolean;
  onResetToDefaults: () => void;
  onSaveChanges: () => void;
}

const RolesPermissionsHeader: React.FC<RolesPermissionsHeaderProps> = ({
  hasUnsavedChanges,
  onResetToDefaults,
  onSaveChanges
}) => {
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
        <span className="mx-2">›</span>
        <span className="hover:text-gray-900 cursor-pointer">Settings</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">Roles & Permissions</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions Management</h1>
          <p className="text-gray-600 mt-1">Configure module access permissions for different user roles</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetToDefaults}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
          >
            <RotateCcw size={18} />
            Reset to Defaults
          </button>
          
          <button
            onClick={onSaveChanges}
            disabled={!hasUnsavedChanges}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissionsHeader;