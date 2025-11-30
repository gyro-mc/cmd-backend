"use client"
import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import StatCards from "./StatCards"
import RevenueCards from "./RevenueCards"
import MachineStatusChart from "./MachineStatusChart"
import RecentAlerts from "./RecentAlerts"
import PatientVisitsChart from "./PatientVisitsChart"
import DialysisSessionsChart from "./DialysisSessionsChart"

export default function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-6 space-y-6">
            {/* Dashboard Overview Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stat Cards */}
            <StatCards />

            {/* Revenue Cards */}
            <RevenueCards />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MachineStatusChart />
              <RecentAlerts />
            </div>

            {/* Bottom Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PatientVisitsChart />
              <DialysisSessionsChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
