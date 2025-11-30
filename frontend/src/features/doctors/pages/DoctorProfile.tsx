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
import { DoctorCard } from "../components/DoctorCard";
import { getDoctorById, updateDoctor, deleteDoctor } from "../api/doctors.api";
import type { Doctor, DoctorFormData } from "../../../types";

interface DoctorProfileProps {
  doctorId: number;
  initialEditMode?: boolean;
  onBack?: () => void;
  onDeleted?: () => void;
}

export function DoctorProfile({
  doctorId,
  initialEditMode = false,
  onBack,
  onDeleted,
}: DoctorProfileProps) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<DoctorFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    salary: 0,
    isMedicalDirector: false,
  });

  useEffect(() => {
    loadDoctor();
  }, [doctorId]);

  const loadDoctor = async () => {
    try {
      setIsLoading(true);
      const data = await getDoctorById(doctorId);
      setDoctor(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        specialization: data.specialization,
        salary: data.salary,
        isMedicalDirector: data.isMedicalDirector,
      });
    } catch (error) {
      console.error("Failed to load doctor:", error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateDoctor(doctorId, formData);
      setIsEditMode(false);
      loadDoctor(); // Reload doctor data
    } catch (error) {
      console.error("Failed to update doctor:", error);
      // TODO: Show error toast
    }
  };

  const handleCancel = () => {
    if (doctor) {
      // Reset form data to original values
      setFormData({
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber,
        specialization: doctor.specialization,
        salary: doctor.salary,
        isMedicalDirector: doctor.isMedicalDirector,
      });
    }
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    if (!doctor) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${doctor.firstName} ${doctor.lastName}? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deleteDoctor(doctorId);
        if (onDeleted) {
          onDeleted();
        }
      } catch (error) {
        console.error("Failed to delete doctor:", error);
        // TODO: Show error toast
      }
    }
  };

  const handleFormChange = (
    field: keyof DoctorFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading || !doctor) {
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
            <BreadcrumbLink onClick={onBack}>Doctors</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Doctor Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DoctorCard
        doctor={doctor}
        isEditMode={isEditMode}
        formData={formData}
        onEdit={() => setIsEditMode(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onFormChange={handleFormChange}
      />
    </div>
  );
}
