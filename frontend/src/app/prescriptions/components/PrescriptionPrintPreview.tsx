// frontend/src/app/prescriptions/components/PrescriptionPrintPreview.tsx
import React from 'react';
import { Beaker } from 'lucide-react';
import type { Medication } from './PrescriptionsLayout';

interface PrescriptionPrintPreviewProps {
  medications: Medication[];
}

const PrescriptionPrintPreview: React.FC<PrescriptionPrintPreviewProps> = ({ medications }) => {
  const filledMedications = medications.filter(med => med.name.trim() !== '');
  const hasContent = filledMedications.length > 0;

  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-teal-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold">Prescription Request Form</h2>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-10 min-h-[600px] max-h-[800px] overflow-y-auto">
            {/* Logo and Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-teal-600">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Beaker className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-teal-600 mb-1">SmartClinic Hemodialysis Center</h1>
              <p className="text-sm text-gray-600">Nephrology & Dialysis Specialized Care</p>
              <p className="text-xs text-gray-500 mt-1">
                Tel: +1 (555) 123-4567 | Email: info@smartclinic.com
              </p>
            </div>

            {/* Form Title */}
            <h2 className="text-2xl font-bold text-center mb-2">PRESCRIPTION REQUEST FORM</h2>
            <p className="text-center text-gray-600 mb-8" style={{ direction: 'rtl' }}>نموذج طلب وصفة طبية</p>

            {/* Patient Information */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div>
                <span className="font-semibold">Patient Name:</span>
                <span className="ml-2">John Michael Doe</span>
              </div>
              <div>
                <span className="font-semibold">Patient ID:</span>
                <span className="ml-2">HD-2024-1234</span>
              </div>
              <div>
                <span className="font-semibold">Age:</span>
                <span className="ml-2">58 years</span>
              </div>
              <div>
                <span className="font-semibold">Gender:</span>
                <span className="ml-2">Male</span>
              </div>
              <div>
                <span className="font-semibold">Request Date:</span>
                <span className="ml-2">November 30, 2025</span>
              </div>
              <div>
                <span className="font-semibold">Requesting Doctor:</span>
                <span className="ml-2">Dr. Sarah Johnson</span>
              </div>
            </div>

            {/* Rx Symbol */}
            <div className="text-5xl font-bold text-teal-600 mb-4">℞</div>

            {/* Requested Medications */}
            <div className="mb-8">
              <h3 className="text-base font-semibold mb-4 pb-2 border-b-2 border-gray-300">
                Requested Medications:
              </h3>

              {hasContent ? (
                <ol className="space-y-3">
                  {filledMedications.map((med, index) => (
                    <li key={med.id} className="flex gap-2 text-sm">
                      <span className="font-semibold text-gray-700 min-w-[24px]">{index + 1}.</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{med.name}</div>
                        <div className="text-gray-600 mt-1 space-y-1">
                          {med.dosage && <div>Dosage: {med.dosage}</div>}
                          {med.frequency && <div>Frequency: {med.frequency}</div>}
                          {med.duration && <div>Duration: {med.duration}</div>}
                          {med.notes && <div>Notes: {med.notes}</div>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="text-center py-12">
                  <p className="text-base italic text-gray-400">No medications added</p>
                  <p className="text-sm text-gray-400 mt-2">Add medications to see them here</p>
                </div>
              )}
            </div>

            {/* Additional Instructions */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-3">
                Additional Instructions / Special Notes:
              </h3>
              <div className="space-y-2">
                <div className="border-b border-gray-300 pb-2"></div>
                <div className="border-b border-gray-300 pb-2"></div>
                <div className="border-b border-gray-300 pb-2"></div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-semibold mb-12">Doctor's Signature:</p>
                <div className="border-b-2 border-gray-400 mb-2"></div>
                <p className="text-sm font-semibold">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500">Medical License #: MD-12345</p>
                <p className="text-xs text-gray-500">Signature Date: ____________</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-4">Pharmacy Stamp:</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Pharmacy Stamp Here</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-300 text-center text-xs text-gray-500 space-y-1">
              <p>This prescription request is valid for 30 days from the date of issue.</p>
              <p>Please present this form along with your prescription at any authorized pharmacy.</p>
              <p>For any queries, please contact SmartClinic at +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPrintPreview;