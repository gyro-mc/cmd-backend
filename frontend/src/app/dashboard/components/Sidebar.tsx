import { Home, Activity, Monitor, FlaskConical, Pill, Users, Calendar, UserPlus, Shield, Settings ,Stethoscope} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Activity, label: "Dialysis Management", path: "/dialysis" },
  { icon: Monitor, label: "Machines Management", path: "/machine" },
  { icon: FlaskConical, label: "Lab Request", path: "/lab-request" },
  { icon: Pill, label: "Prescriptions", path: "/prescriptions" },
  { icon: Stethoscope, label: "doctor", path: "/doctor" },
  { icon: Users, label: "Patients", path: "/patients" },
  { icon: Calendar, label: "Appointments", path: "/appointments" },
]

const adminItems = [
  { icon: UserPlus, label: "Add System User", path: "/admin/add-user" },
  { icon: Shield, label: "Roles & Permissions", path: "/admin/roles" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-72 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SmartClinic</h1>
            <p className="text-sm text-gray-500">Web Portal</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Admin Section */}
        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">
            ADMIN
          </h3>
          <nav className="space-y-1">
            {adminItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-teal-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}