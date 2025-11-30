// Mock static data for demonstration
const mockProtocol = {
  dialysisDays: ["Monday", "Wednesday", "Friday"],
  sessionsPerWeek: 3,
  generator: "Fresenius 5008",
  sessionDuration: "4 hours",
  dialyser: "FX80",
  needle: "15G",
  bloodFlow: "300",
  anticoagulation: "Heparin 5000 IU",
  dryWeight: "70",
  interDialyticWeightGain: "2.5",
  incidents: ["Hypotension episode on 2024-11-15", "Cramps during session"],
};

export function DialysisProtocolSection() {
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="space-y-6">
      {/* Dialysis Days */}
      <div>
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          Dialysis Days
        </label>
        <div className="flex flex-wrap gap-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className={`px-3 py-2 rounded-lg text-sm ${
                mockProtocol.dialysisDays.includes(day)
                  ? "bg-[#1C8CA8] text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Sessions per Week
          </label>
          <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
            <p className="text-sm text-gray-900">
              {mockProtocol.sessionsPerWeek}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Generator</label>
          <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
            <p className="text-sm text-gray-900">{mockProtocol.generator}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Session Duration
          </label>
          <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
            <p className="text-sm text-gray-900">
              {mockProtocol.sessionDuration}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Dialyser</label>
          <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
            <p className="text-sm text-gray-900">{mockProtocol.dialyser}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Needle</label>
          <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
            <p className="text-sm text-gray-900">{mockProtocol.needle}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Blood Flow (mL/min)
          </label>
          <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
            <p className="text-sm text-gray-900">{mockProtocol.bloodFlow}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Anticoagulation
          </label>
          <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
            <p className="text-sm text-gray-900">
              {mockProtocol.anticoagulation}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Dry Weight (kg)
          </label>
          <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
            <p className="text-sm text-gray-900">{mockProtocol.dryWeight}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Interdialytic Weight Gain (kg)
          </label>
          <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
            <p className="text-sm text-gray-900">
              {mockProtocol.interDialyticWeightGain}
            </p>
          </div>
        </div>
      </div>

      {/* Incidents */}
      {mockProtocol.incidents && mockProtocol.incidents.length > 0 && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Incidents</label>
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <ul className="list-disc list-inside space-y-1">
              {mockProtocol.incidents.map((incident, index) => (
                <li key={index} className="text-sm text-gray-900">
                  {incident}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
