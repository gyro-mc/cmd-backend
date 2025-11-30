import { Edit, Save, X, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { FormCard } from "../../../components/shared/FormCard";
import { PageHeader } from "../../../components/shared/PageHeader";
import type { Doctor, DoctorFormData } from "../../../types";

interface DoctorCardProps {
  doctor: Doctor;
  isEditMode: boolean;
  formData: DoctorFormData;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onFormChange: (
    field: keyof DoctorFormData,
    value: string | number | boolean
  ) => void;
}

export function DoctorCard({
  doctor,
  isEditMode,
  formData,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onFormChange,
}: DoctorCardProps) {
  return (
    <>
      <PageHeader
        title={`Doctor Details — ${doctor.firstName} ${doctor.lastName}`}
        actions={
          isEditMode ? (
            <>
              <Button
                variant="outline"
                onClick={onCancel}
                className="gap-2 bg-white border-gray-200"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={onSave}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onDelete}
                className="gap-2 bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete Doctor
              </Button>
              <Button
                onClick={onEdit}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Edit className="w-4 h-4" />
                Edit Doctor
              </Button>
            </>
          )
        }
      />

      <FormCard title="Doctor Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            {isEditMode ? (
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => onFormChange("firstName", e.target.value)}
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">{formData.firstName}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            {isEditMode ? (
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => onFormChange("lastName", e.target.value)}
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">{formData.lastName}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditMode ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onFormChange("email", e.target.value)}
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">{formData.email}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            {isEditMode ? (
              <Input
                id="phone"
                value={formData.phoneNumber}
                onChange={(e) => onFormChange("phoneNumber", e.target.value)}
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">{formData.phoneNumber}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            {isEditMode ? (
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => onFormChange("specialization", e.target.value)}
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">
                  {formData.specialization}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            {isEditMode ? (
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  onFormChange("salary", parseFloat(e.target.value) || 0)
                }
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">
                  ${formData.salary.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 flex items-center gap-2 pt-7">
            {isEditMode ? (
              <>
                <input
                  id="isMedicalDirector"
                  type="checkbox"
                  checked={formData.isMedicalDirector}
                  onChange={(e) =>
                    onFormChange("isMedicalDirector", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="isMedicalDirector" className="cursor-pointer">
                  Medical Director
                </Label>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isMedicalDirector}
                  disabled
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label>Medical Director</Label>
              </div>
            )}
          </div>
        </div>
      </FormCard>
    </>
  );
}
