import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import type { AppointmentWithDetails } from "../../../types";

const mockAppointments: AppointmentWithDetails[] = [
  {
    id: 1,
    createdAt: "2025-12-05T10:00:00",
    date: "2025-12-05",
    estimatedDuration: "30",
    doctorId: "1",
    doctorName: "Dr. Sarah Anderson",
    patientId: "HD-2024-1234",
    patientName: "John Doe",
    roomNumber: 101,
    status: "scheduled",
    reason: "Regular checkup",
  },
  {
    id: 2,
    createdAt: "2025-12-05T14:00:00",
    date: "2025-12-05",
    estimatedDuration: "45",
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    patientId: "HD-2024-1235",
    patientName: "Sarah Johnson",
    roomNumber: 102,
    status: "scheduled",
    reason: "Follow-up",
  },
  {
    id: 3,
    createdAt: "2025-12-10T09:00:00",
    date: "2025-12-10",
    estimatedDuration: "30",
    doctorId: "3",
    doctorName: "Dr. Emily Rodriguez",
    patientId: "HD-2024-1236",
    patientName: "Robert Martinez",
    roomNumber: 103,
    status: "scheduled",
    reason: "Lab results review",
  },
];

interface CalendarViewProps {
  onViewAppointment?: (appointmentId: number) => void;
  onCreate?: () => void;
  onBackToList?: () => void;
}

export function CalendarView({
  onViewAppointment,
  onCreate,
  onBackToList,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return mockAppointments.filter((apt) => apt.date === dateStr);
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)
    );
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const renderMonthView = () => {
    const days = [];
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDayOfWeek + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        dayNumber
      );
      const appointments = isValidDay ? getAppointmentsForDate(date) : [];
      const isToday =
        isValidDay && date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={i}
          className={`min-h-[120px] border border-gray-200 p-2 ${
            isValidDay ? "bg-white hover:bg-gray-50" : "bg-gray-50"
          } ${isToday ? "ring-2 ring-[#1C8CA8]" : ""}`}
        >
          {isValidDay && (
            <>
              <div
                className={`text-sm font-medium mb-2 ${
                  isToday ? "text-[#1C8CA8]" : "text-gray-700"
                }`}
              >
                {dayNumber}
              </div>
              <div className="space-y-1">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() =>
                      onViewAppointment && onViewAppointment(apt.id)
                    }
                    className="text-xs p-1 rounded bg-[#1C8CA8] text-white cursor-pointer hover:bg-[#157A93] truncate"
                  >
                    <div className="font-medium">{apt.patientName}</div>
                    <div className="text-[10px] opacity-90">
                      {apt.doctorName}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#101828] text-base font-normal">
            Appointments Calendar
          </h1>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onBackToList}
            variant="outline"
            className="gap-2 bg-white border-gray-200"
          >
            <CalendarIcon className="w-4 h-4" />
            List View
          </Button>
          <Button
            onClick={onCreate}
            className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
          >
            <Plus className="w-4 h-4" />
            Create Appointment
          </Button>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeMonth(-1)}
              className="border-gray-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">{monthName}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeMonth(1)}
              className="border-gray-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={view === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("month")}
              className={
                view === "month"
                  ? "bg-[#1C8CA8] hover:bg-[#157A93]"
                  : "border-gray-200"
              }
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("week")}
              className={
                view === "week"
                  ? "bg-[#1C8CA8] hover:bg-[#157A93]"
                  : "border-gray-200"
              }
            >
              Week
            </Button>
            <Button
              variant={view === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("day")}
              className={
                view === "day"
                  ? "bg-[#1C8CA8] hover:bg-[#157A93]"
                  : "border-gray-200"
              }
            >
              Day
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        {view === "month" && (
          <div className="p-4">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-0">{renderMonthView()}</div>
          </div>
        )}

        {view === "week" && (
          <div className="p-6 text-center text-gray-500">
            Week view coming soon...
          </div>
        )}

        {view === "day" && (
          <div className="p-6 text-center text-gray-500">
            Day view coming soon...
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Status Legend
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              Scheduled
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
              Completed
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
              Canceled
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
