import { useState, useEffect } from "react";
import { Edit, ChevronDown, ChevronUp, Save, X, Trash2 } from "lucide-react";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Loader } from "../../../components/shared/Loader";
import { VascularAccessSection } from "../components/VascularAccessSection";
import { VaccinationSection } from "../components/VaccinationSection";
import { DialysisProtocolSection } from "../components/DialysisProtocolSection";
import { MedicationsSection } from "../components/MedicationsSection";
import { LabResultsSection } from "../components/LabResultsSection";
import {
  getPatientById,
  updatePatient,
  deletePatient,
} from "../api/patients.api";
import type { Patient, PatientFormData } from "../../../types";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-b from-[#1c8ca8] to-[#157a93] h-12 flex items-center justify-between px-6 hover:from-[#157a93] hover:to-[#136a7d] transition-colors"
      >
        <h2 className="text-base text-white font-normal">{title}</h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-white" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white" />
        )}
      </button>
      {isOpen && <div className="p-6">{children}</div>}
    </div>
  );
}

interface CollapsibleSubsectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSubsection({
  title,
  children,
  defaultOpen = true,
}: CollapsibleSubsectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 text-base font-semibold text-gray-900 hover:text-[#1c8ca8] transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3"
      >
        {isOpen ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronUp className="w-5 h-5 rotate-180" />
        )}
        <h3>{title}</h3>
      </button>
      {isOpen && <div className="px-1">{children}</div>}
    </div>
  );
}

interface PatientProfileProps {
  patientId: string;
  initialEditMode?: boolean;
  onBack?: () => void;
  onDeleted?: () => void;
}

export function PatientProfile({
  patientId,
  initialEditMode = false,
  onBack,
  onDeleted,
}: PatientProfileProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<PatientFormData>({
    name: "",
    address: "",
    phone_number: "",
    profession: "",
    children_number: 0,
    family_situation: "",
    birth_date: "",
  });

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  const loadPatient = async () => {
    try {
      setIsLoading(true);
      const data = await getPatientById(patientId);
      setPatient(data);
      setFormData({
        name: data.name,
        address: data.address,
        phone_number: data.phone_number,
        profession: data.profession,
        children_number: data.children_number,
        family_situation: data.family_situation,
        birth_date: data.birth_date,
      });
    } catch (error) {
      console.error("Failed to load patient:", error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updatePatient(patientId, formData);
      setIsEditMode(false);
      loadPatient(); // Reload patient data
    } catch (error) {
      console.error("Failed to update patient:", error);
      // TODO: Show error toast
    }
  };

  const handleCancel = () => {
    if (patient) {
      // Reset form data to original values
      setFormData({
        name: patient.name,
        address: patient.address,
        phone_number: patient.phone_number,
        profession: patient.profession,
        children_number: patient.children_number,
        family_situation: patient.family_situation,
        birth_date: patient.birth_date,
      });
    }
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    if (!patient) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.name}? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deletePatient(patientId);
        if (onDeleted) {
          onDeleted();
        }
      } catch (error) {
        console.error("Failed to delete patient:", error);
        // TODO: Show error toast
      }
    }
  };

  const handleFormChange = (
    field: keyof PatientFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading || !patient) {
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
            <BreadcrumbLink onClick={onBack}>Patients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Patient Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#101828] text-base font-normal">
            Patient Details — {patient.name}
          </h1>
        </div>
        <div className="flex gap-3">
          {isEditMode ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="gap-2 bg-white border-gray-200"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
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
                onClick={handleDelete}
                className="gap-2 bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete Patient
              </Button>
              <Button
                onClick={() => setIsEditMode(true)}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Edit className="w-4 h-4" />
                Edit Patient
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Administrative File Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-b from-[#1c8ca8] to-[#157a93] h-12 flex items-center px-6">
          <h2 className="text-base text-white font-normal">
            Administrative File
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              {isEditMode ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
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
                  value={formData.birth_date}
                  onChange={(e) =>
                    handleFormChange("birth_date", e.target.value)
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">{formData.birth_date}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              {isEditMode ? (
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">{formData.address}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditMode ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleFormChange("phone_number", e.target.value)
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">
                    {formData.phone_number}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyStatus">Family Situation</Label>
              {isEditMode ? (
                <Select
                  value={formData.family_situation}
                  onValueChange={(value) =>
                    handleFormChange("family_situation", value)
                  }
                >
                  <SelectTrigger id="familyStatus">
                    <SelectValue />
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
                    {formData.family_situation}
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
                  value={formData.children_number}
                  onChange={(e) =>
                    handleFormChange(
                      "children_number",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">
                    {formData.children_number}
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
                  onChange={(e) =>
                    handleFormChange("profession", e.target.value)
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">{formData.profession}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medical File Section */}
      <CollapsibleSection title="Medical File (Read Only)" defaultOpen={true}>
        <div className="space-y-6">
          {/* Basic Medical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Initial Nephropathy
              </label>
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">Diabetic Nephropathy</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                First Dialysis Date
              </label>
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">2022-03-15</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Care Start Date
              </label>
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">2024-01-10</p>
              </div>
            </div>
          </div>

          {/* Vascular Access */}
          <CollapsibleSubsection title="Vascular Access" defaultOpen={true}>
            <VascularAccessSection />
          </CollapsibleSubsection>

          {/* Vaccinations */}
          <CollapsibleSubsection title="Vaccinations" defaultOpen={true}>
            <VaccinationSection />
          </CollapsibleSubsection>

          {/* Dialysis Protocol */}
          <CollapsibleSubsection title="Dialysis Protocol" defaultOpen={true}>
            <DialysisProtocolSection />
          </CollapsibleSubsection>

          {/* Current Medications */}
          <CollapsibleSubsection title="Current Medications" defaultOpen={true}>
            <MedicationsSection />
          </CollapsibleSubsection>

          {/* Lab Results */}
          <CollapsibleSubsection title="Recent Lab Results" defaultOpen={true}>
            <LabResultsSection />
          </CollapsibleSubsection>

          {/* Clinical Summary */}
          <CollapsibleSubsection title="Clinical Summary" defaultOpen={true}>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-900 leading-relaxed">
                Patient is a 62-year-old male with end-stage renal disease
                secondary to diabetic nephropathy. He has been on hemodialysis
                since March 2022. Current vascular access is an arteriovenous
                fistula in the left forearm, functioning well. Patient is
                compliant with his dialysis schedule (MWF) and medication
                regimen. Recent lab results show stable hemoglobin levels with
                adequate anemia management. Blood pressure is well-controlled.
                Patient reports good quality of life and minimal complications.
              </p>
            </div>
          </CollapsibleSubsection>
        </div>
      </CollapsibleSection>
    </div>
  );
}
