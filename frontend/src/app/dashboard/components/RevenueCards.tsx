"use client"

import { DollarSign } from "lucide-react"

const revenues = [
  {
    icon: DollarSign,
    label: "Weekly Revenue",
    value: "$125,430",
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-400",
  },
  {
    icon: DollarSign,
    label: "Monthly Revenue",
    value: "$487,650",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-400",
  },
]

export default function RevenueCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {revenues.map((revenue, index) => {
        const Icon = revenue.icon
        return (
          <div key={index} className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{revenue.label}</p>
                <p className="text-3xl font-bold text-foreground">{revenue.value}</p>
              </div>
              <div className={`${revenue.bgColor} p-4 rounded-lg`}>
                <Icon className={`w-6 h-6 ${revenue.iconColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
