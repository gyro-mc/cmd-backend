"use client"

import { AlertTriangle, Info, CheckCircle } from "lucide-react"

const alerts = [
  {
    icon: AlertTriangle,
    title: "Machine #12 requires maintenance",
    time: "10 minutes ago",
    type: "warning",
    color: "text-orange-500",
  },
  {
    icon: Info,
    title: "New patient registration: John Smith",
    time: "25 minutes ago",
    type: "info",
    color: "text-blue-500",
  },
  {
    icon: CheckCircle,
    title: "Blood test results ready for Patient #4521",
    time: "1 hour ago",
    type: "success",
    color: "text-green-500",
  },
  {
    icon: AlertTriangle,
    title: "Low inventory: Dialysate solution",
    time: "2 hours ago",
    type: "warning",
    color: "text-orange-500",
  },
]

export default function RecentAlerts() {
  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
        <span className="text-sm font-semibold text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">4</span>
      </div>
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const Icon = alert.icon
          return (
            <div key={index} className="flex gap-3 pb-4 border-b border-border last:border-b-0">
              <Icon className={`w-5 h-5 ${alert.color} flex-shrink-0 mt-0.5`} />
              <div>
                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
