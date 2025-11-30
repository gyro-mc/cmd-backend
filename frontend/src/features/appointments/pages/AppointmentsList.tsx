import { useState, useEffect } from "react";
import { Plus, CalendarDays, Eye, Edit, Clock } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { PageHeader } from "../../../components/shared/PageHeader";
import { SearchBar } from "../../../components/shared/SearchBar";
import { Loader } from "../../../components/shared/Loader";
import { DataTable } from "../../../components/shared/DataTable";
import type { Column } from "../../../components/shared/DataTable";
import { getAppointments } from "../api/appointments.api";
import type { AppointmentWithDetails } from "../../../types";

interface AppointmentsListPageProps {
  onViewAppointment?: (appointmentId: number) => void;
  onEditAppointment?: (appointmentId: number) => void;
  onCreate?: () => void;
  onViewCalendar?: () => void;
}

export function AppointmentsList({
  onViewAppointment,
  onEditAppointment,
  onCreate,
  onViewCalendar,
}: AppointmentsListPageProps) {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      appointment.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleViewAppointment = (appointmentId: number) => {
    if (onViewAppointment) {
      onViewAppointment(appointmentId);
    }
  };

  const handleEditAppointment = (appointmentId: number) => {
    if (onEditAppointment) {
      onEditAppointment(appointmentId);
    }
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    }
  };

  const handleViewCalendar = () => {
    if (onViewCalendar) {
      onViewCalendar();
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            Scheduled
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
            Completed
          </Badge>
        );
      case "canceled":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
            Canceled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 text-xs">
            Unknown
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const appointmentColumns: Column<AppointmentWithDetails>[] = [
    {
      key: "id",
      header: "ID",
      className: "text-xs",
      render: (appointment) => (
        <span className="text-sm text-gray-600">{appointment.id}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      className: "text-xs",
      render: (appointment) => (
        <span className="text-sm">{formatDate(appointment.date)}</span>
      ),
    },
    {
      key: "patient",
      header: "Patient",
      className: "text-xs",
      render: (appointment) => (
        <span className="text-sm font-medium">{appointment.patientName}</span>
      ),
    },
    {
      key: "doctor",
      header: "Doctor",
      className: "text-xs",
      render: (appointment) => (
        <span className="text-sm">{appointment.doctorName}</span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      className: "text-xs",
      render: (appointment) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock className="w-3 h-3" />
          {appointment.estimatedDuration} min
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "text-xs",
      render: (appointment) => getStatusBadge(appointment.status),
    },
    {
      key: "reason",
      header: "Reason",
      className: "text-xs",
      render: (appointment) => (
        <span className="text-sm text-gray-600 line-clamp-1">
          {appointment.reason || "N/A"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-xs text-center",
      render: (appointment) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleViewAppointment(appointment.id);
            }}
            className="gap-1 text-[#1C8CA8] hover:bg-teal-50 hover:text-[#157A93]"
          >
            <Eye className="w-3 h-3" />
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleEditAppointment(appointment.id);
            }}
            className="gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit className="w-3 h-3" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <PageHeader title="Appointments Management" />

      {/* Main White Card Container */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Search and Filters Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4 mb-6">
            <SearchBar
              placeholder="Search by patient, doctor, or reason..."
              value={searchTerm}
              onChange={setSearchTerm}
            />

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleViewCalendar}
                variant="outline"
                className="gap-2"
              >
                <CalendarDays className="w-4 h-4" />
                Calendar View
              </Button>
              <Button
                onClick={handleCreate}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Plus className="w-4 h-4" />
                Create Appointment
              </Button>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <DataTable
              data={filteredAppointments}
              columns={appointmentColumns}
              getRowKey={(appointment) => String(appointment.id)}
              selectedKey={
                selectedAppointmentId ? String(selectedAppointmentId) : null
              }
              onRowClick={(appointment) =>
                setSelectedAppointmentId(appointment.id)
              }
              emptyMessage="No appointments found matching your criteria"
            />
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredAppointments.length} of {appointments.length}{" "}
            appointments
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-200">
              Previous
            </Button>
            <Button size="sm" className="bg-[#1C8CA8] hover:bg-[#157A93]">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
