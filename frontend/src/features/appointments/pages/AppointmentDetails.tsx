import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Loader } from "../../../components/shared/Loader";
import { AppointmentCard } from "../components/AppointmentCard";
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../api/appointments.api";
import { getDoctors } from "../../doctors/api/doctors.api";
import { getPatients } from "../../patients/api/patients.api";
import type {
  AppointmentWithDetails,
  AppointmentFormData,
} from "../../../types";

interface AppointmentDetailsProps {
  appointmentId: number;
  initialEditMode?: boolean;
  onBack?: () => void;
  onDeleted?: () => void;
}

export function AppointmentDetails({
  appointmentId,
  initialEditMode = false,
  onBack,
  onDeleted,
}: AppointmentDetailsProps) {
  const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [formData, setFormData] = useState<AppointmentFormData>({
    date: "",
    estimatedDuration: "",
    doctorId: "",
    patientId: "",
    roomNumber: 0,
    status: "scheduled",
    reason: "",
  });

  useEffect(() => {
    loadData();
  }, [appointmentId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [appointmentData, doctorsData, patientsData] = await Promise.all([
        getAppointmentById(appointmentId),
        getDoctors(),
        getPatients(),
      ]);

      setAppointment(appointmentData);
      setDoctors(doctorsData.map((d) => ({ id: d.id, name: d.name })));
      setPatients(patientsData.map((p) => ({ id: p.id, name: p.name })));
      setFormData({
        date: appointmentData.date,
        estimatedDuration: appointmentData.estimatedDuration || "",
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        roomNumber: appointmentData.roomNumber || 0,
        status: appointmentData.status || "scheduled",
        reason: appointmentData.reason || "",
      });
    } catch (error) {
      console.error("Failed to load appointment:", error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateAppointment(appointmentId, formData);
      setIsEditMode(false);
      loadData(); // Reload appointment data
    } catch (error) {
      console.error("Failed to update appointment:", error);
      // TODO: Show error toast
    }
  };

  const handleCancel = () => {
    if (appointment) {
      // Reset form data to original values
      setFormData({
        date: appointment.date,
        estimatedDuration: appointment.estimatedDuration || "",
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        roomNumber: appointment.roomNumber || 0,
        status: appointment.status || "scheduled",
        reason: appointment.reason || "",
      });
    }
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    if (!appointment) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete this appointment? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deleteAppointment(appointmentId);
        if (onDeleted) {
          onDeleted();
        }
      } catch (error) {
        console.error("Failed to delete appointment:", error);
        // TODO: Show error toast
      }
    }
  };

  const handleFormChange = (
    field: keyof AppointmentFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading || !appointment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onBack}>Appointments</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Appointment Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <AppointmentCard
        appointment={appointment}
        isEditMode={isEditMode}
        formData={formData}
        onEdit={() => setIsEditMode(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onFormChange={handleFormChange}
        doctors={doctors}
        patients={patients}
      />
    </div>
  );
}
