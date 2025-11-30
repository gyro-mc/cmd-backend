// Mock static data for demonstration
const mockMedications = [
  {
    name: "Epoetin Alfa",
    history: [
      { startDate: "2024-01-15", dosage: "4000 IU, 3x/week" },
      { startDate: "2024-06-01", dosage: "6000 IU, 3x/week" },
    ],
  },
  {
    name: "Ferrous Sulfate",
    history: [{ startDate: "2024-02-01", dosage: "325 mg daily" }],
  },
  {
    name: "Calcium Carbonate",
    history: [{ startDate: "2024-01-15", dosage: "500 mg, 3x/day" }],
  },
];

export function MedicationsSection() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Medication Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Start Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Dosage
            </th>
          </tr>
        </thead>
        <tbody>
          {mockMedications.map((medication, medIndex) =>
            medication.history.map((history, histIndex) => (
              <tr
                key={`${medIndex}-${histIndex}`}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                {histIndex === 0 && (
                  <td
                    className="px-4 py-3 text-sm text-gray-900"
                    rowSpan={medication.history.length}
                  >
                    {medication.name}
                  </td>
                )}
                <td className="px-4 py-3 text-sm text-gray-900">
                  {history.startDate}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {history.dosage}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
