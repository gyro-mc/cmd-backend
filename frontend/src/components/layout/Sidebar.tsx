import {
  Home,
  Droplets,
  FlaskConical,
  Users,
  Calendar,
  Settings,
  FileBarChart,
  Pill,
  Monitor,
  Receipt,
  UserPlus,
  Shield,
  LogOut,
  UserCheck,
} from "lucide-react";
import { Button } from "../ui/button";

interface SidebarProps {
  currentPage:
    | "dialysis-management"
    | "lab-request"
    | "prescription"
    | "machines-management"
    | "billing"
    | "settings"
    | "add-user"
    | "roles-permissions"
    | "patients-list"
    | "register-patient"
    | "patient-details"
    | "doctors-list"
    | "add-doctor"
    | "doctor-details"
    | "appointments-list"
    | "create-appointment"
    | "appointment-details"
    | "calendar-view"
    | "doctor-availability";
  onNavigate: (
    page:
      | "dialysis-management"
      | "lab-request"
      | "prescription"
      | "machines-management"
      | "billing"
      | "settings"
      | "add-user"
      | "roles-permissions"
      | "patients-list"
      | "register-patient"
      | "patient-details"
      | "doctors-list"
      | "add-doctor"
      | "doctor-details"
      | "appointments-list"
      | "create-appointment"
      | "appointment-details"
      | "calendar-view"
      | "doctor-availability"
  ) => void;
  collapsed?: boolean;
}

export function Sidebar({
  currentPage,
  onNavigate,
  collapsed = false,
}: SidebarProps) {
  const menuItems = [
    { icon: Home, label: "Dashboard", page: null },
    {
      icon: Droplets,
      label: "Dialysis Management",
      page: "dialysis-management" as const,
    },
    {
      icon: Monitor,
      label: "Machines Management",
      page: "machines-management" as const,
    },
    { icon: FileBarChart, label: "Lab Request", page: "lab-request" as const },
    { icon: Pill, label: "Prescriptions", page: "prescription" as const },
    { icon: Receipt, label: "Billing & Payments", page: "billing" as const },
    { icon: FlaskConical, label: "Laboratory", page: null },
    { icon: Users, label: "Patients", page: "patients-list" as const },
    { icon: UserCheck, label: "Doctors", page: "doctors-list" as const },
    {
      icon: Calendar,
      label: "Appointments",
      page: "appointments-list" as const,
    },
  ];

  const adminMenuItems = [
    { icon: UserPlus, label: "Add System User", page: "add-user" as const },
    {
      icon: Shield,
      label: "Roles & Permissions",
      page: "roles-permissions" as const,
    },
    { icon: Settings, label: "Settings", page: "settings" as const },
  ];

  return (
    <div
      className="min-h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out"
      style={{ width: collapsed ? "80px" : "256px" }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-[#1C8CA8] flex items-center justify-center shrink-0">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-gray-900">SmartClinic</h1>
              <p className="text-sm text-gray-500">Web Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = item.page === currentPage;
            return (
              <li key={item.label}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full ${
                    collapsed ? "justify-center px-2" : "justify-start"
                  } gap-3 ${
                    isActive
                      ? "bg-[#1C8CA8] text-white hover:bg-[#157A93]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => item.page && onNavigate(item.page)}
                  disabled={!item.page}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </li>
            );
          })}
        </ul>

        {/* Admin Section */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          {!collapsed && (
            <p className="text-xs text-gray-500 px-3 mb-2">ADMIN</p>
          )}
          <ul className="space-y-2">
            {adminMenuItems.map((item) => {
              const isActive = item.page === currentPage;
              return (
                <li key={item.label}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full ${
                      collapsed ? "justify-center px-2" : "justify-start"
                    } gap-3 ${
                      isActive
                        ? "bg-[#1C8CA8] text-white hover:bg-[#157A93]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => onNavigate(item.page)}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <Button
          variant="ghost"
          className={`w-full ${
            collapsed ? "justify-center px-2" : "justify-start"
          } gap-3 text-red-600 hover:bg-red-50 hover:text-red-700`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
