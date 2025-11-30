"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", visits: 45 },
  { name: "Tue", visits: 52 },
  { name: "Wed", visits: 48 },
  { name: "Thu", visits: 61 },
  { name: "Fri", visits: 55 },
  { name: "Sat", visits: 38 },
  { name: "Sun", visits: 28 },
]

export default function PatientVisitsChart() {
  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Patient Visits This Week</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#2563eb"
              dot={{ fill: "#2563eb", r: 5 }}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
