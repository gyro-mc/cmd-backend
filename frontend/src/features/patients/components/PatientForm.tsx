import { useState } from "react";
import { User, Phone, MapPin, Calendar, Save, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { FormCard } from "../../../components/shared/FormCard";
import type { PatientFormData } from "../../../types";

interface PatientFormProps {
  initialData?: Partial<PatientFormData>;
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function PatientForm({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Register Patient",
}: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    address: initialData.address || "",
    phoneNumber: initialData.phoneNumber || "",
    profession: initialData.profession || "",
    childrenNumber: initialData.childrenNumber || 0,
    familySituation: initialData.familySituation || "",
    birthDate: initialData.birthDate || "",
    gender: initialData.gender || "",
    insuranceNumber: initialData.insuranceNumber || "",
    emergencyContactName: initialData.emergencyContactName || "",
    emergencyContactPhone: initialData.emergencyContactPhone || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PatientFormData, string>>
  >({});

  const handleInputChange = (
    field: keyof PatientFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof PatientFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Birth date is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
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
      <FormCard title="Basic Information">
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
                onChange={(e) => handleInputChange("firstName", e.target.value)}
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
            <Input
              id="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
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
            <Label htmlFor="birthDate">
              Birth Date <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                className={`pl-10 ${errors.birthDate ? "border-red-500" : ""}`}
              />
            </div>
            {errors.birthDate && (
              <p className="text-sm text-red-500">{errors.birthDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">
              Gender <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange("gender", value)}
            >
              <SelectTrigger
                id="gender"
                className={errors.gender ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="address"
                placeholder="123 Main St, City, State 12345"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              placeholder="Engineer"
              value={formData.profession}
              onChange={(e) => handleInputChange("profession", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insuranceNumber">Insurance Number</Label>
            <Input
              id="insuranceNumber"
              placeholder="INS-123456789"
              value={formData.insuranceNumber}
              onChange={(e) =>
                handleInputChange("insuranceNumber", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="familySituation">Family Situation</Label>
            <Select
              value={formData.familySituation}
              onValueChange={(value) =>
                handleInputChange("familySituation", value)
              }
            >
              <SelectTrigger id="familySituation">
                <SelectValue placeholder="Select family situation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="childrenNumber">Children Number</Label>
            <Input
              id="childrenNumber"
              type="number"
              placeholder="0"
              value={formData.childrenNumber}
              onChange={(e) =>
                handleInputChange(
                  "childrenNumber",
                  parseInt(e.target.value) || 0
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
            <Input
              id="emergencyContactName"
              placeholder="Jane Doe"
              value={formData.emergencyContactName}
              onChange={(e) =>
                handleInputChange("emergencyContactName", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhone">
              Emergency Contact Phone
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="emergencyContactPhone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  handleInputChange("emergencyContactPhone", e.target.value)
                }
                className="pl-10"
              />
            </div>
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
