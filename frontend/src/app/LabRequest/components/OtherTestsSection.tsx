// frontend/src/app/lab-request/components/OtherTestsSection.tsx
import React from 'react';

interface OtherTestsSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const OtherTestsSection: React.FC<OtherTestsSectionProps> = ({ value, onChange }) => {
  const characterCount = value.length;
  const maxCharacters = 500;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Other Requested Tests</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter any additional tests not listed above
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxCharacters) {
              onChange(e.target.value);
            }
          }}
          placeholder="Enter any additional tests not listed above..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-gray-900 placeholder-gray-400"
        />
        
        {/* Character Counter */}
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            Additional tests will be included in the lab request form
          </p>
          <p className={`text-xs ${characterCount > maxCharacters * 0.9 ? 'text-orange-600' : 'text-gray-500'}`}>
            {characterCount} / {maxCharacters}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtherTestsSection;