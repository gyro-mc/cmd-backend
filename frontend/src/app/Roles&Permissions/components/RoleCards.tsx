// frontend/src/app/roles-permissions/components/RoleCards.tsx
import React from 'react';
import { Shield, Stethoscope, Users, Clipboard } from 'lucide-react';

interface RoleStats {
  enabled: number;
  total: number;
}

interface RoleCardsProps {
  stats: {
    administrator: RoleStats;
    doctor: RoleStats;
    nurse: RoleStats;
    receptionist: RoleStats;
  };
}

const RoleCards: React.FC<RoleCardsProps> = ({ stats }) => {
  const roles = [
    {
      id: 'administrator',
      name: 'Administrator',
      icon: Shield,
      color: 'purple',
      badge: 'Locked',
      description: 'Full system access',
      stats: stats.administrator
    },
    {
      id: 'doctor',
      name: 'Doctor',
      icon: Stethoscope,
      color: 'blue',
      badge: 'Editable',
      description: 'Medical & prescriptions',
      stats: stats.doctor
    },
    {
      id: 'nurse',
      name: 'Nurse',
      icon: Users,
      color: 'green',
      badge: 'Editable',
      description: 'Patient care & sessions',
      stats: stats.nurse
    },
    {
      id: 'receptionist',
      name: 'Receptionist',
      icon: Clipboard,
      color: 'orange',
      badge: 'Editable',
      description: 'Billing & registration',
      stats: stats.receptionist
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; icon: string; badge: string } } = {
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-900',
        icon: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-700'
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-900',
        icon: 'text-green-600',
        badge: 'bg-green-100 text-green-700'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-900',
        icon: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-700'
      }
    };
    return colors[color];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {roles.map((role) => {
        const colors = getColorClasses(role.color);
        const Icon = role.icon;
        
        return (
          <div
            key={role.id}
            className={`${colors.bg} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center border border-gray-200`}>
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                {role.badge}
              </span>
            </div>
            
            <h3 className={`text-lg font-bold ${colors.text} mb-1`}>{role.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{role.description}</p>
            
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{role.stats.enabled}</span> / {role.stats.total} modules
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoleCards;