"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "In Use", value: 61, color: "#2563eb" },
  { name: "Available", value: 26, color: "#16a34a" },
  { name: "Out of Service", value: 8, color: "#ef4444" },
  { name: "Maintenance", value: 9, color: "#f59e0b" },
]

export default function MachineStatusChart() {
  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Machine Status Overview</h3>
      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm text-foreground">
              {item.name}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
