import { useState } from "react";
import { Calendar, Clock, FileText, Save, X } from "lucide-react";
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
import { Textarea } from "../../../components/ui/textarea";
import { FormCard } from "../../../components/shared/FormCard";
import type { AppointmentFormData } from "../../../types";

interface AppointmentFormProps {
  initialData?: Partial<AppointmentFormData>;
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  doctors?: Array<{ id: string; name: string }>;
  patients?: Array<{ id: string; name: string }>;
}

export function AppointmentForm({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Create Appointment",
  doctors = [],
  patients = [],
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    date: initialData.date || "",
    estimatedDuration: initialData.estimatedDuration || "",
    doctorId: initialData.doctorId || "",
    patientId: initialData.patientId || "",
    roomNumber: initialData.roomNumber || 0,
    status: initialData.status || "scheduled",
    reason: initialData.reason || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AppointmentFormData, string>>
  >({});

  const handleInputChange = (
    field: keyof AppointmentFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof AppointmentFormData, string>> = {};

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.estimatedDuration) {
      newErrors.estimatedDuration = "Duration is required";
    }

    if (!formData.doctorId) {
      newErrors.doctorId = "Doctor is required";
    }

    if (!formData.patientId) {
      newErrors.patientId = "Patient is required";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
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
      <FormCard title="Appointment Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date">
              Date <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={`pl-10 ${errors.date ? "border-red-500" : ""}`}
              />
            </div>
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedDuration">
              Estimated Duration (minutes){" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="estimatedDuration"
                type="text"
                placeholder="30"
                value={formData.estimatedDuration}
                onChange={(e) =>
                  handleInputChange("estimatedDuration", e.target.value)
                }
                className={`pl-10 ${
                  errors.estimatedDuration ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.estimatedDuration && (
              <p className="text-sm text-red-500">
                {errors.estimatedDuration}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">
              Doctor <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.doctorId}
              onValueChange={(value) => handleInputChange("doctorId", value)}
            >
              <SelectTrigger
                id="doctor"
                className={errors.doctorId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.doctorId && (
              <p className="text-sm text-red-500">{errors.doctorId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient">
              Patient <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.patientId}
              onValueChange={(value) => handleInputChange("patientId", value)}
            >
              <SelectTrigger
                id="patient"
                className={errors.patientId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.patientId && (
              <p className="text-sm text-red-500">{errors.patientId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomNumber">Room Number</Label>
            <Input
              id="roomNumber"
              type="number"
              placeholder="101"
              value={formData.roomNumber}
              onChange={(e) =>
                handleInputChange("roomNumber", parseInt(e.target.value) || 0)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="reason">
              Reason <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Textarea
                id="reason"
                placeholder="Enter reason for appointment..."
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                className={`pl-10 min-h-[100px] ${
                  errors.reason ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason}</p>
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
