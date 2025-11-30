import { useState } from "react";
import { User, Phone, Mail, Stethoscope, Save, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { FormCard } from "../../../components/shared/FormCard";
import type { DoctorFormData } from "../../../types";

interface DoctorFormProps {
  initialData?: Partial<DoctorFormData>;
  onSubmit: (data: DoctorFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function DoctorForm({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Add Doctor",
}: DoctorFormProps) {
  const [formData, setFormData] = useState<DoctorFormData>({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    phoneNumber: initialData.phoneNumber || "",
    specialization: initialData.specialization || "",
    salary: initialData.salary || 0,
    isMedicalDirector: initialData.isMedicalDirector || false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof DoctorFormData, string>>
  >({});

  const handleInputChange = (
    field: keyof DoctorFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof DoctorFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
    }

    if (formData.salary <= 0) {
      newErrors.salary = "Salary must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormCard title="Doctor Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) =>
                  handleInputChange("firstName", e.target.value)
                }
                className={`pl-10 ${errors.firstName ? "border-red-500" : ""}`}
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`pl-10 ${errors.lastName ? "border-red-500" : ""}`}
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="doctor@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className={`pl-10 ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">
              Specialization <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="specialization"
                placeholder="Nephrology"
                value={formData.specialization}
                onChange={(e) =>
                  handleInputChange("specialization", e.target.value)
                }
                className={`pl-10 ${
                  errors.specialization ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.specialization && (
              <p className="text-sm text-red-500">{errors.specialization}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">
              Salary <span className="text-red-500">*</span>
            </Label>
            <Input
              id="salary"
              type="number"
              placeholder="150000"
              value={formData.salary}
              onChange={(e) =>
                handleInputChange("salary", parseFloat(e.target.value) || 0)
              }
              className={errors.salary ? "border-red-500" : ""}
            />
            {errors.salary && (
              <p className="text-sm text-red-500">{errors.salary}</p>
            )}
          </div>

          <div className="space-y-2 flex items-center gap-2 pt-7">
            <input
              id="isMedicalDirector"
              type="checkbox"
              checked={formData.isMedicalDirector}
              onChange={(e) =>
                handleInputChange("isMedicalDirector", e.target.checked)
              }
              className="w-4 h-4 rounded border-gray-300"
            />
            <Label htmlFor="isMedicalDirector" className="cursor-pointer">
              Medical Director
            </Label>
          </div>
        </div>
      </FormCard>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
