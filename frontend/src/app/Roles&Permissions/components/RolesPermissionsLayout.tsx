// frontend/src/app/roles-permissions/components/RolesPermissionsLayout.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../dashboard/components/Sidebar';
import Topbar from '../../machines/components/Topbar';
import RolesPermissionsHeader from './RolesPermissionsHeader';
import SecurityWarning from './SecurityWarning';
import RoleCards from './RoleCards';
import PermissionsTable from './PermissionsTable';
import PermissionGuidelines from './PermissionGuidelines';

export interface ModulePermission {
  moduleId: string;
  moduleName: string;
  icon: string;
  administrator: boolean;
  doctor: boolean;
  nurse: boolean;
  receptionist: boolean;
}

const initialPermissions: ModulePermission[] = [
  {
    moduleId: 'dashboard',
    moduleName: 'Dashboard',
    icon: 'Home',
    administrator: true,
    doctor: true,
    nurse: true,
    receptionist: true
  },
  {
    moduleId: 'patients',
    moduleName: 'Patients',
    icon: 'Users',
    administrator: true,
    doctor: true,
    nurse: true,
    receptionist: true
  },
  {
    moduleId: 'doctors',
    moduleName: 'Doctors',
    icon: 'Stethoscope',
    administrator: true,
    doctor: false,
    nurse: false,
    receptionist: true
  },
  {
    moduleId: 'appointments',
    moduleName: 'Appointments',
    icon: 'Calendar',
    administrator: true,
    doctor: true,
    nurse: false,
    receptionist: true
  },
  {
    moduleId: 'dialysis',
    moduleName: 'Dialysis Management',
    icon: 'Activity',
    administrator: true,
    doctor: true,
    nurse: true,
    receptionist: false
  },
  {
    moduleId: 'lab',
    moduleName: 'Lab Requests',
    icon: 'Beaker',
    administrator: true,
    doctor: true,
    nurse: false,
    receptionist: false
  },
  {
    moduleId: 'prescriptions',
    moduleName: 'Prescriptions',
    icon: 'Pill',
    administrator: true,
    doctor: true,
    nurse: false,
    receptionist: false
  },
  {
    moduleId: 'machines',
    moduleName: 'Machines Management',
    icon: 'Monitor',
    administrator: true,
    doctor: false,
    nurse: true,
    receptionist: false
  },
  {
    moduleId: 'billing',
    moduleName: 'Billing',
    icon: 'CreditCard',
    administrator: true,
    doctor: false,
    nurse: false,
    receptionist: true
  },
  {
    moduleId: 'settings',
    moduleName: 'Settings',
    icon: 'Settings',
    administrator: true,
    doctor: false,
    nurse: false,
    receptionist: false
  }
];

const RolesPermissionsLayout: React.FC = () => {
  const [permissions, setPermissions] = useState<ModulePermission[]>(initialPermissions);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const original = JSON.stringify(initialPermissions);
    const current = JSON.stringify(permissions);
    setHasUnsavedChanges(original !== current);
  }, [permissions]);

  const handleTogglePermission = (moduleId: string, role: 'doctor' | 'nurse' | 'receptionist') => {
    setPermissions(permissions.map(perm =>
      perm.moduleId === moduleId
        ? { ...perm, [role]: !perm[role] }
        : perm
    ));
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all permissions to defaults? This action cannot be undone.')) {
      setPermissions(initialPermissions);
      setHasUnsavedChanges(false);
    }
  };

  const handleSaveChanges = () => {
    console.log('Saving permissions...', permissions);
    
    // TODO: Replace with actual API call
    // await api.savePermissions(permissions);
    
    localStorage.setItem('roles_permissions', JSON.stringify(permissions));
    
    alert('Permissions saved successfully!');
    setHasUnsavedChanges(false);
  };

  // Calculate role statistics
  const getRoleStats = () => {
    return {
      administrator: {
        enabled: permissions.filter(p => p.administrator).length,
        total: permissions.length
      },
      doctor: {
        enabled: permissions.filter(p => p.doctor).length,
        total: permissions.length
      },
      nurse: {
        enabled: permissions.filter(p => p.nurse).length,
        total: permissions.length
      },
      receptionist: {
        enabled: permissions.filter(p => p.receptionist).length,
        total: permissions.length
      }
    };
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <RolesPermissionsHeader 
              hasUnsavedChanges={hasUnsavedChanges}
              onResetToDefaults={handleResetToDefaults}
              onSaveChanges={handleSaveChanges}
            />
            
            <SecurityWarning />
            
            {hasUnsavedChanges && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      You have unsaved permission changes. Click "Save Changes" to apply them.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <RoleCards stats={getRoleStats()} />
            
            <PermissionsTable
              permissions={permissions}
              onTogglePermission={handleTogglePermission}
            />
            
            <PermissionGuidelines />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissionsLayout;