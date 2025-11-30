import { Edit, Save, X, Trash2 } from "lucide-react";
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
import { PageHeader } from "../../../components/shared/PageHeader";
import type { Patient, PatientFormData } from "../../../types";

interface PatientCardProps {
  patient: Patient;
  isEditMode: boolean;
  formData: PatientFormData;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onFormChange: (field: keyof PatientFormData, value: string | number) => void;
}

export function PatientCard({
  patient,
  isEditMode,
  formData,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onFormChange,
}: PatientCardProps) {
  return (
    <>
      <PageHeader
        title={`Patient Details — ${patient.name}`}
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
                Delete Patient
              </Button>
              <Button
                onClick={onEdit}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Edit className="w-4 h-4" />
                Edit Patient
              </Button>
            </>
          )
        }
      />

      <FormCard title="Administrative File">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            {isEditMode ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onFormChange("name", e.target.value)}
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">{formData.name}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            {isEditMode ? (
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => onFormChange("birthDate", e.target.value)}
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">{formData.birthDate}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            {isEditMode ? (
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => onFormChange("address", e.target.value)}
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">{formData.address}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
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
            <Label htmlFor="familySituation">Family Situation</Label>
            {isEditMode ? (
              <Select
                value={formData.familySituation}
                onValueChange={(value) =>
                  onFormChange("familySituation", value)
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
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">
                  {formData.familySituation}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="childrenNumber">Children Number</Label>
            {isEditMode ? (
              <Input
                id="childrenNumber"
                type="number"
                value={formData.childrenNumber}
                onChange={(e) =>
                  onFormChange("childrenNumber", parseInt(e.target.value) || 0)
                }
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">
                  {formData.childrenNumber}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            {isEditMode ? (
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => onFormChange("profession", e.target.value)}
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">{formData.profession}</p>
              </div>
            )}
          </div>
        </div>
      </FormCard>
    </>
  );
}
