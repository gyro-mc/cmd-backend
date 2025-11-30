import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Phone, Mail } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { PageHeader } from "../../../components/shared/PageHeader";
import { SearchBar } from "../../../components/shared/SearchBar";
import { Loader } from "../../../components/shared/Loader";
import { DataTable } from "../../../components/shared/DataTable";
import type { Column } from "../../../components/shared/DataTable";
import { getDoctors } from "../api/doctors.api";
import type { Doctor } from "../../../types";

interface DoctorsListPageProps {
  onViewDoctor?: (doctorId: string) => void;
  onEditDoctor?: (doctorId: string) => void;
  onAddNew?: () => void;
}

export function DoctorsList({
  onViewDoctor,
  onEditDoctor,
  onAddNew,
}: DoctorsListPageProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      const data = await getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error("Failed to load doctors:", error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.email &&
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const handleViewDoctor = (doctorId: string) => {
    if (onViewDoctor) {
      onViewDoctor(doctorId);
    }
  };

  const handleEditDoctor = (doctorId: string) => {
    if (onEditDoctor) {
      onEditDoctor(doctorId);
    }
  };

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew();
    }
  };

  const doctorColumns: Column<Doctor>[] = [
    {
      key: "id",
      header: "ID",
      render: (doctor) => (
        <span className="text-sm text-gray-600">{doctor.id}</span>
      ),
    },
    {
      key: "name",
      header: "Doctor",
      render: (doctor) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">{doctor.name}</p>
        </div>
      ),
    },
    {
      key: "specialty",
      header: "Specialty",
      render: (doctor) => <span className="text-sm">{doctor.specialty}</span>,
    },
    {
      key: "contact",
      header: "Contact",
      render: (doctor) => (
        <div className="space-y-1">
          {doctor.phone_number && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Phone className="w-3 h-3" />
              {doctor.phone_number}
            </div>
          )}
          {doctor.email && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Mail className="w-3 h-3" />
              {doctor.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-center",
      render: (doctor) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDoctor(doctor.id);
            }}
            className="gap-1 text-[#1C8CA8] hover:bg-teal-50 hover:text-[#157A93]"
          >
            <Eye className="w-3 h-3" />
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleEditDoctor(doctor.id);
            }}
            className="gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit className="w-3 h-3" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <PageHeader title="Doctors Management" />

      {/* Main White Card Container */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Search and Statistics Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4 mb-6">
            <SearchBar
              placeholder="Search by name, specialty, phone, or email..."
              value={searchTerm}
              onChange={setSearchTerm}
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddNew}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Plus className="w-4 h-4" />
                Add New Doctor
              </Button>
            </div>
          </div>
        </div>

        {/* Doctors Table */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <DataTable
              data={filteredDoctors}
              columns={doctorColumns}
              getRowKey={(doctor) => doctor.id}
              selectedKey={selectedDoctorId}
              onRowClick={(doctor) => setSelectedDoctorId(doctor.id)}
              emptyMessage="No doctors found matching your criteria"
            />
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredDoctors.length} of {doctors.length} doctors
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-200">
              Previous
            </Button>
            <Button size="sm" className="bg-[#1C8CA8] hover:bg-[#157A93]">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
