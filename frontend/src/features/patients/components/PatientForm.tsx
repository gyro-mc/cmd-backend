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
    name: initialData.name || "",
    address: initialData.address || "",
    phone_number: initialData.phone_number || "",
    profession: initialData.profession || "",
    children_number: initialData.children_number || 0,
    family_situation: initialData.family_situation || "",
    birth_date: initialData.birth_date || "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    }

    if (!formData.birth_date) {
      newErrors.birth_date = "Birth date is required";
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
      <FormCard title="Administrative File">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="name"
                placeholder="John Michael Doe"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
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
            <Label htmlFor="phoneNumber">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone_number}
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
                className={`pl-10 ${
                  errors.phone_number ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.phone_number && (
              <p className="text-sm text-red-500">{errors.phone_number}</p>
            )}
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
            <Label htmlFor="childrenNumber">Children Number</Label>
            <Input
              id="childrenNumber"
              type="number"
              placeholder="0"
              value={formData.children_number}
              onChange={(e) =>
                handleInputChange(
                  "children_number",
                  parseInt(e.target.value) || 0
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="familySituation">Family Situation</Label>
            <Select
              value={formData.family_situation}
              onValueChange={(value) =>
                handleInputChange("family_situation", value)
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
            <Label htmlFor="birthDate">
              Birth Date <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="birthDate"
                type="date"
                value={formData.birth_date}
                onChange={(e) =>
                  handleInputChange("birth_date", e.target.value)
                }
                className={`pl-10 ${errors.birth_date ? "border-red-500" : ""}`}
              />
            </div>
            {errors.birth_date && (
              <p className="text-sm text-red-500">{errors.birth_date}</p>
            )}
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
