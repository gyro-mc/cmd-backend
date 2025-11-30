"use client"

import { Users, Activity, Zap, Users2 } from "lucide-react"

const stats = [
  {
    icon: Users,
    label: "Total Patients",
    value: "342",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-400",
  },
  {
    icon: Activity,
    label: "Active Sessions Today",
    value: "28",
    bgColor: "bg-green-50",
    iconColor: "text-green-400",
  },
  {
    icon: Zap,
    label: "Available Machines",
    value: "12",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-400",
  },
  {
    icon: Users2,
    label: "Staff on Duty",
    value: "32",
    sublabel: "8 Doctors, 24 Nurses",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-400",
  },
]

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                {stat.sublabel && <p className="text-xs text-muted-foreground mt-1">{stat.sublabel}</p>}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
