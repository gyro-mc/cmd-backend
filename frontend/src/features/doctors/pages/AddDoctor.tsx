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
import { DoctorForm } from "../components/DoctorForm";
import { createDoctor } from "../api/doctors.api";
import type { DoctorFormData } from "../../../types";

export function AddDoctor({
  onCancel,
  onSuccess,
}: {
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: DoctorFormData) => {
    try {
      setIsLoading(true);
      await createDoctor(data);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to add doctor:", error);
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
            <BreadcrumbLink onClick={handleCancel}>Doctors</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Doctor</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Add New Doctor"
        subtitle="Add a new doctor to the system"
      />

      <DoctorForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        submitLabel="Add Doctor"
      />
    </div>
  );
}
