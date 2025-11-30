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
  patientId: number;
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
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    address: "",
    phoneNumber: "",
    profession: "",
    childrenNumber: 0,
    familySituation: "",
    birthDate: "",
    insuranceNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
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
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        gender: data.gender,
        address: data.address,
        phoneNumber: data.phoneNumber,
        profession: data.profession,
        childrenNumber: data.childrenNumber,
        familySituation: data.familySituation,
        birthDate: data.birthDate,
        insuranceNumber: data.insuranceNumber,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
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
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        gender: patient.gender,
        address: patient.address,
        phoneNumber: patient.phoneNumber,
        profession: patient.profession,
        childrenNumber: patient.childrenNumber,
        familySituation: patient.familySituation,
        birthDate: patient.birthDate,
        insuranceNumber: patient.insuranceNumber,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactPhone: patient.emergencyContactPhone,
      });
    }
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    if (!patient) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.firstName} ${patient.lastName}? This action cannot be undone.`
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
            Patient Details — {patient.firstName} {patient.lastName}
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
              <Label htmlFor="firstName">First Name</Label>
              {isEditMode ? (
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleFormChange("firstName", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleFormChange("lastName", e.target.value)
                  }
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
                  onChange={(e) => handleFormChange("email", e.target.value)}
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">{formData.email}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              {isEditMode ? (
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleFormChange("gender", value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">{formData.gender}</p>
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
                  onChange={(e) =>
                    handleFormChange("birthDate", e.target.value)
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">{formData.birthDate}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditMode ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleFormChange("phoneNumber", e.target.value)
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">
                    {formData.phoneNumber}
                  </p>
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
              <Label htmlFor="insuranceNumber">Insurance Number</Label>
              {isEditMode ? (
                <Input
                  id="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={(e) =>
                    handleFormChange("insuranceNumber", e.target.value)
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">
                    {formData.insuranceNumber}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">
                Emergency Contact Name
              </Label>
              {isEditMode ? (
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) =>
                    handleFormChange("emergencyContactName", e.target.value)
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">
                    {formData.emergencyContactName}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">
                Emergency Contact Phone
              </Label>
              {isEditMode ? (
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) =>
                    handleFormChange("emergencyContactPhone", e.target.value)
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">
                    {formData.emergencyContactPhone}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyStatus">Family Situation</Label>
              {isEditMode ? (
                <Select
                  value={formData.familySituation}
                  onValueChange={(value) =>
                    handleFormChange("familySituation", value)
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
                    handleFormChange(
                      "childrenNumber",
                      parseInt(e.target.value) || 0
                    )
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
