import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { PageHeader } from "../../../components/shared/PageHeader";
import { PatientForm } from "../components/PatientForm";
import { createPatient } from "../api/patients.api";
import type { PatientFormData } from "../../../types";

export function RegisterPatient({
  onCancel,
  onSuccess,
}: {
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PatientFormData) => {
    try {
      setIsLoading(true);
      await createPatient(data);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to register patient:", error);
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
            <BreadcrumbLink onClick={handleCancel}>Patients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Register New Patient</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Register New Patient"
        subtitle="Add a new patient to the system with complete medical information"
      />

      <PatientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        submitLabel="Register Patient"
      />
    </div>
  );
}
