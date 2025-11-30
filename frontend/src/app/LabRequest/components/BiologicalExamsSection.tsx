// frontend/src/app/lab-request/components/BiologicalExamsSection.tsx
import React from 'react';
import { Beaker } from 'lucide-react';

interface BiologicalExamsSectionProps {
  selectedTests: number[];
  onTestToggle: (testId: number) => void;
  onSelectAll: (testIds: number[]) => void;
}

// Same test data structure as in PrintPreview
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

const BiologicalExamsSection: React.FC<BiologicalExamsSectionProps> = ({
  selectedTests,
  onTestToggle,
  onSelectAll,
}) => {
  const allTestIds = testData.map(test => test.id);
  const allSelected = allTestIds.every(id => selectedTests.includes(id));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Beaker className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">EXAMENS BIOLOGIQUES</h2>
            <p className="text-sm text-gray-600">Biological Exams</p>
          </div>
        </div>
      </div>

      {/* Select All Button */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => onSelectAll(allTestIds)}
          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          {allSelected ? 'Désélectionner tout' : 'Sélectionner tout'}
        </button>
      </div>

      {/* Tests Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testData.map((test) => (
            <label
              key={test.id}
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedTests.includes(test.id)}
                onChange={() => onTestToggle(test.id)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">{test.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiologicalExamsSection;