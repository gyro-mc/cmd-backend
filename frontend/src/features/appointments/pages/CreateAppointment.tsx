import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { PageHeader } from "../../../components/shared/PageHeader";
import { AppointmentForm } from "../components/AppointmentForm";
import { createAppointment } from "../api/appointments.api";
import { getDoctors } from "../../doctors/api/doctors.api";
import { getPatients } from "../../patients/api/patients.api";
import type { AppointmentFormData } from "../../../types";

export function CreateAppointment({
  onCancel,
  onSuccess,
}: {
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>(
    []
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [doctorsData, patientsData] = await Promise.all([
        getDoctors(),
        getPatients(),
      ]);
      setDoctors(doctorsData.map((d) => ({ id: d.id, name: d.name })));
      setPatients(patientsData.map((p) => ({ id: p.id, name: p.name })));
    } catch (error) {
      console.error("Failed to load doctors/patients:", error);
      // TODO: Show error toast
    }
  };

  const handleSubmit = async (data: AppointmentFormData) => {
    try {
      setIsLoading(true);
      await createAppointment(data);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create appointment:", error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={handleCancel}>Appointments</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create New Appointment</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Create New Appointment"
        subtitle="Schedule a new appointment for a patient"
      />

      <AppointmentForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        submitLabel="Create Appointment"
        doctors={doctors}
        patients={patients}
      />
    </div>
  );
}
