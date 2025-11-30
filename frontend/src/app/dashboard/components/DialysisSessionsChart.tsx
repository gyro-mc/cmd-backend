"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", sessions: 32 },
  { name: "Tue", sessions: 40 },
  { name: "Wed", sessions: 36 },
  { name: "Thu", sessions: 43 },
  { name: "Fri", sessions: 38 },
  { name: "Sat", sessions: 28 },
  { name: "Sun", sessions: 20 },
]

export default function DialysisSessionsChart() {
  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Dialysis Sessions by Day</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
            <Bar dataKey="sessions" fill="#16a34a" radius={[8, 8, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
