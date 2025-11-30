// Mock static data for demonstration
const mockVascularAccess = [
  {
    type: "Arteriovenous Fistula",
    site: "Left Forearm",
    operator: "Dr. Sarah Anderson",
    firstUseDate: "2024-03-15",
    creationDates: ["2024-02-01", "2024-02-15"],
  },
];

export function VascularAccessSection() {
  return (
    <div className="space-y-4">
      {mockVascularAccess.map((access, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Type</label>
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">{access.type}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Site</label>
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">{access.site}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Operator
              </label>
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">{access.operator}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                First Use Date
              </label>
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">{access.firstUseDate}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Creation Dates
              </label>
              <div className="bg-gray-50 h-auto min-h-[36px] rounded-lg px-3 py-2">
                <p className="text-sm text-gray-900">
                  {access.creationDates.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
