import { Calendar, Clock, UserCheck } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

interface DoctorAvailability {
  doctorId: string;
  doctorName: string;
  available_days: string[];
  working_hours: {
    start: string;
    end: string;
  };
}

const mockDoctorAvailability: DoctorAvailability[] = [
  {
    doctorId: "1",
    doctorName: "Dr. Sarah Anderson",
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    working_hours: {
      start: "08:00",
      end: "17:00",
    },
  },
  {
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    available_days: ["Monday", "Wednesday", "Friday"],
    working_hours: {
      start: "09:00",
      end: "15:00",
    },
  },
  {
    doctorId: "3",
    doctorName: "Dr. Emily Rodriguez",
    available_days: ["Tuesday", "Thursday", "Saturday"],
    working_hours: {
      start: "10:00",
      end: "18:00",
    },
  },
  {
    doctorId: "4",
    doctorName: "Dr. James Wilson",
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    working_hours: {
      start: "08:00",
      end: "16:00",
    },
  },
  {
    doctorId: "5",
    doctorName: "Dr. Lisa Thompson",
    available_days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    working_hours: {
      start: "07:00",
      end: "15:00",
    },
  },
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function DoctorAvailability() {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#101828] text-base font-normal">
            Doctor Availability
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Weekly schedule and working hours for all doctors
          </p>
        </div>
      </div>

      {/* Availability Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockDoctorAvailability.map((doctor) => (
          <div
            key={doctor.doctorId}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-b from-[#1c8ca8] to-[#157a93] h-12 flex items-center px-6">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-white" />
                <h2 className="text-base text-white font-normal">
                  {doctor.doctorName}
                </h2>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4">
              {/* Working Hours */}
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Working Hours:</span>
                <span>
                  {formatTime(doctor.working_hours.start)} -{" "}
                  {formatTime(doctor.working_hours.end)}
                </span>
              </div>

              {/* Available Days */}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Available Days:</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => {
                    const isAvailable = doctor.available_days.includes(day);
                    return (
                      <div
                        key={day}
                        className={`text-center py-2 px-1 rounded text-xs font-medium ${
                          isAvailable
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-50 text-gray-400 border border-gray-200"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="pt-3 border-t border-gray-200">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  {doctor.available_days.length} days per week
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Grid Overview */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-b from-[#1c8ca8] to-[#157a93] h-12 flex items-center px-6">
          <h2 className="text-base text-white font-normal">
            Weekly Schedule Overview
          </h2>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Doctor
                  </th>
                  {daysOfWeek.map((day) => (
                    <th
                      key={day}
                      className="text-center py-3 px-2 text-sm font-medium text-gray-700"
                    >
                      {day.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockDoctorAvailability.map((doctor) => (
                  <tr
                    key={doctor.doctorId}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {doctor.doctorName}
                    </td>
                    {daysOfWeek.map((day) => {
                      const isAvailable = doctor.available_days.includes(day);
                      return (
                        <td key={day} className="text-center py-3 px-2">
                          {isAvailable ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                              <div className="w-3 h-3 rounded-full bg-green-600"></div>
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
