import React from 'react';
import { Beaker } from 'lucide-react';

interface PrintPreviewProps {
  selectedTests: number[];
  otherTests: string;
}

// Complete test data with IDs and names
const testData = [
  { id: 1, name: 'Hématies' },
  { id: 2, name: 'Hémoglobine' },
  { id: 3, name: 'Hématocrite' },
  { id: 4, name: 'VGM' },
  { id: 5, name: 'TCHM' },
  { id: 6, name: 'CCHM' },
  { id: 7, name: 'Plaquettes' },
  { id: 8, name: 'Neutrophiles (%)' },
  { id: 9, name: 'Lymphocytes (%)' },
  { id: 10, name: 'Lymphocytes (Absolute)' },
  { id: 11, name: 'Monocytes (%)' },
  { id: 12, name: 'Eosinophiles (%)' },
  { id: 13, name: 'Basophiles (%)' },
  { id: 14, name: 'Urée sanguine' },
  { id: 15, name: 'Créatinine sanguine' },
  { id: 16, name: 'Acide Urique' },
  { id: 17, name: 'Examen Cytobactériologique des Urines' },
];

const PrintPreview: React.FC<PrintPreviewProps> = ({ selectedTests, otherTests }) => {
  const hasContent = selectedTests.length > 0 || otherTests.trim().length > 0;

  // Get the actual test names based on selected IDs
  const selectedTestNames = selectedTests
    .map(testId => testData.find(test => test.id === testId)?.name)
    .filter(Boolean) as string[];

  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Print Preview</h2>
          <p className="text-xs text-gray-500 mt-1">Live preview of the lab request form</p>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 min-h-[600px] max-h-[800px] overflow-y-auto">
            {/* Logo and Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-teal-600">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Beaker className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-teal-600 mb-1">SmartClinic</h1>
              <p className="text-sm text-gray-600">Hemodialysis & Nephrology Center</p>
            </div>

            {/* Form Title - Added width constraint */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-2xl"> {/* Added width constraint */}
                <h2 className="text-2xl font-bold text-center text-gray-900 border-b-2 border-teal-600 pb-2">
                  LABORATORY REQUEST FORM
                </h2>
              </div>
            </div>

            {/* Patient Information */}
            <div className="space-y-3 mb-8 text-sm">
              <div className="flex justify-between">
                <div>
                  <span className="font-semibold">Patient:</span>
                  <span className="ml-2">John Michael Doe</span>
                </div>
                <div>
                  <span className="font-semibold">ID:</span>
                  <span className="ml-2">HD-2024-1234</span>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <span className="font-semibold">Age:</span>
                  <span className="ml-2">58 years</span>
                </div>
                <div>
                  <span className="font-semibold">Gender:</span>
                  <span className="ml-2">Male</span>
                </div>
              </div>

              <div>
                <span className="font-semibold">Doctor:</span>
                <span className="ml-2">Dr. Sarah Johnson</span>
              </div>

              <div>
                <span className="font-semibold">Date:</span>
                <span className="ml-2">November 30, 2025</span>
              </div>
            </div>

            {/* Requested Tests */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3 pb-2 border-b border-gray-300">
                Requested Tests:
              </h3>
              
              {hasContent ? (
                <>
                  {selectedTestNames.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {selectedTestNames.map((testName, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2 text-teal-600">•</span>
                          <span>{testName}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {otherTests.trim() && (
                    <div className={selectedTestNames.length > 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''}>
                      <p className="text-sm font-semibold mb-2">Additional Tests:</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{otherTests}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm italic text-gray-400">No tests selected</p>
                  <p className="text-xs text-gray-400 mt-2">Select tests to see them appear here</p>
                </div>
              )}
            </div>

            {/* Signature */}
            <div className="mt-12 pt-6 border-t border-gray-300">
              <div className="text-right">
                <p className="text-sm font-semibold mb-12">Doctor's Signature</p>
                <div className="border-b-2 border-gray-300 w-48 ml-auto mb-2"></div>
                <p className="text-sm font-semibold">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500">November 30, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;