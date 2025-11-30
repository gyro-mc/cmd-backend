import { Monitor, CheckCircle, Clock, Wrench, XCircle } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  icon: React.ElementType
  iconBgColor: string
  iconColor: string
}

function StatCard({ label, value, icon: Icon, iconBgColor, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}

export default function MachinesStats() {
  const stats = [
    {
      label: "Total Machines",
      value: "8",
      icon: Monitor,
      iconBgColor: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      label: "Available",
      value: "4",
      icon: CheckCircle,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "In Use",
      value: "2",
      icon: Clock,
      iconBgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Maintenance",
      value: "1",
      icon: Wrench,
      iconBgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      label: "Out of Service",
      value: "1",
      icon: XCircle,
      iconBgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}