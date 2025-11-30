// Mock static data for demonstration
const mockLabResults = [
  {
    date: "2024-11-25",
    parameters: {
      "Hemoglobin (g/dL)": "11.2",
      "Creatinine (mg/dL)": "8.5",
      "Potassium (mEq/L)": "4.8",
      "Calcium (mg/dL)": "9.2",
      "Phosphorus (mg/dL)": "5.1",
    },
  },
  {
    date: "2024-11-18",
    parameters: {
      "Hemoglobin (g/dL)": "10.8",
      "Creatinine (mg/dL)": "8.2",
      "Potassium (mEq/L)": "5.1",
      "Calcium (mg/dL)": "9.0",
      "Phosphorus (mg/dL)": "5.3",
    },
  },
  {
    date: "2024-11-11",
    parameters: {
      "Hemoglobin (g/dL)": "10.5",
      "Creatinine (mg/dL)": "8.7",
      "Potassium (mEq/L)": "4.9",
      "Calcium (mg/dL)": "8.8",
      "Phosphorus (mg/dL)": "5.5",
    },
  },
];

export function LabResultsSection() {
  // Get all unique parameter names
  const allParameters = Array.from(
    new Set(mockLabResults.flatMap((result) => Object.keys(result.parameters)))
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Date
            </th>
            {allParameters.map((param) => (
              <th
                key={param}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600"
              >
                {param}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mockLabResults.map((result, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-sm text-gray-900">{result.date}</td>
              {allParameters.map((param) => (
                <td key={param} className="px-4 py-3 text-sm text-gray-900">
                  {(result.parameters as Record<string, string>)[param] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
