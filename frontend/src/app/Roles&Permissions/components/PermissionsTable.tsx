// frontend/src/app/roles-permissions/components/PermissionsTable.tsx
import React from 'react';
import { 
  Home, Users, Stethoscope, Calendar, Activity, 
  Beaker, Pill, Monitor, CreditCard, Settings as SettingsIcon,
  Shield, CheckCircle2
} from 'lucide-react';
import type { ModulePermission } from './RolesPermissionsLayout';

interface PermissionsTableProps {
  permissions: ModulePermission[];
  onTogglePermission: (moduleId: string, role: 'doctor' | 'nurse' | 'receptionist') => void;
}

const iconMap: { [key: string]: React.ElementType } = {
  Home,
  Users,
  Stethoscope,
  Calendar,
  Activity,
  Beaker,
  Pill,
  Monitor,
  CreditCard,
  Settings: SettingsIcon
};

const PermissionsTable: React.FC<PermissionsTableProps> = ({
  permissions,
  onTogglePermission
}) => {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Home;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">Module Access Permissions</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Toggle access permissions for each role. Admin permissions are locked and cannot be modified.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Module</th>
              <th className="px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-900">Administrator</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    Locked
                  </span>
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-900">Doctor</span>
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Users className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-semibold text-gray-900">Nurse</span>
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                  <span className="text-sm font-semibold text-gray-900">Receptionist</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {permissions.map((permission) => (
              <tr key={permission.moduleId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="text-teal-600">
                      {getIcon(permission.icon)}
                    </div>
                    <span className="font-medium text-gray-900">{permission.moduleName}</span>
                  </div>
                </td>
                
                {/* Administrator - Always checked and disabled */}
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                </td>
                
                {/* Doctor */}
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onTogglePermission(permission.moduleId, 'doctor')}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      style={{
                        backgroundColor: permission.doctor ? '#000' : '#d1d5db'
                      }}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          permission.doctor ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </td>
                
                {/* Nurse */}
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onTogglePermission(permission.moduleId, 'nurse')}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      style={{
                        backgroundColor: permission.nurse ? '#000' : '#d1d5db'
                      }}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          permission.nurse ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </td>
                
                {/* Receptionist */}
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onTogglePermission(permission.moduleId, 'receptionist')}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      style={{
                        backgroundColor: permission.receptionist ? '#000' : '#d1d5db'
                      }}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          permission.receptionist ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionsTable;