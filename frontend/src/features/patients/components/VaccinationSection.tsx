// Mock static data for demonstration
const mockVaccinations = [
  {
    vaccineName: "Hepatitis B",
    doses: [
      { doseNumber: 1, date: "2024-01-10", reminderDate: "2024-07-10" },
      { doseNumber: 2, date: "2024-02-10", reminderDate: "2024-08-10" },
      { doseNumber: 3, date: "2024-06-10", reminderDate: "2025-06-10" },
    ],
  },
  {
    vaccineName: "Influenza",
    doses: [{ doseNumber: 1, date: "2024-10-01", reminderDate: "2025-10-01" }],
  },
];

export function VaccinationSection() {
  return (
    <div className="space-y-6">
      {mockVaccinations.map((vaccination, index) => (
        <div key={index}>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            {vaccination.vaccineName}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vaccination.doses.map((dose) => (
              <div key={dose.doseNumber} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Dose {dose.doseNumber}
                </label>
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">{dose.date}</p>
                </div>
                {dose.reminderDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Reminder: {dose.reminderDate}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
