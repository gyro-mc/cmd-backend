// frontend/src/app/lab-request/components/LabRequestLayout.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../dashboard/components/Sidebar';
import Topbar from '../../machines/components/Topbar';
import LabRequestHeader from './LabRequestHeader';
import PatientInfoSection from './PatientInfoSection';
import BiologicalExamsSection from './BiologicalExamsSection';
import OtherTestsSection from './OtherTestsSection';
import PrintPreview from './PrintPreview';

interface LabRequestState {
  selectedTests: number[];
  otherTests: string;
  savedAt?: string;
}

const LabRequestLayout: React.FC = () => {
  const [selectedTests, setSelectedTests] = useState<number[]>([]);
  const [otherTests, setOtherTests] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(selectedTests.length > 0 || otherTests.trim().length > 0);
  }, [selectedTests, otherTests]);

  // Warn before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleTestToggle = (testId: number) => {
    setSelectedTests(prev =>
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleSelectAll = (testIds: number[]) => {
    const allSelected = testIds.every(id => selectedTests.includes(id));
    if (allSelected) {
      setSelectedTests(prev => prev.filter(id => !testIds.includes(id)));
    } else {
      setSelectedTests(prev => [...new Set([...prev, ...testIds])]);
    }
  };

  const handleSave = () => {
    const labRequest: LabRequestState = {
      selectedTests,
      otherTests,
      savedAt: new Date().toISOString()
    };

    console.log('Saving lab request...', labRequest);
    
    // TODO: Replace with actual API call
    // await api.saveLabRequest(labRequest);
    
    // Save to localStorage as backup
    localStorage.setItem('lab_request_draft', JSON.stringify(labRequest));
    
    alert('Lab request saved successfully!');
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        setSelectedTests([]);
        setOtherTests('');
        localStorage.removeItem('lab_request_draft');
        setHasUnsavedChanges(false);
      }
    } else {
      // If no changes, just clear
      setSelectedTests([]);
      setOtherTests('');
    }
  };

  const handlePrint = () => {
    if (selectedTests.length === 0 && !otherTests.trim()) {
      alert('Please select at least one test before printing.');
      return;
    }
    
    // Save before printing
    if (hasUnsavedChanges) {
      const shouldSave = window.confirm('Would you like to save before printing?');
      if (shouldSave) {
        handleSave();
      }
    }
    
    window.print();
  };

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('lab_request_draft');
    if (draft) {
      try {
        const parsed: LabRequestState = JSON.parse(draft);
        const shouldLoad = window.confirm('A draft lab request was found. Would you like to load it?');
        if (shouldLoad) {
          setSelectedTests(parsed.selectedTests || []);
          setOtherTests(parsed.otherTests || '');
        } else {
          localStorage.removeItem('lab_request_draft');
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
        localStorage.removeItem('lab_request_draft');
      }
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <LabRequestHeader 
              selectedTests={selectedTests}
              otherTests={otherTests}
              onSave={handleSave}
              onCancel={handleCancel}
              onPrint={handlePrint}
            />
            
            {/* Unsaved changes indicator */}
            {hasUnsavedChanges && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 mt-4 rounded">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      You have unsaved changes. Don't forget to save your work.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Left Section - Form */}
              <div className="lg:col-span-2 space-y-6">
                <PatientInfoSection />
                <BiologicalExamsSection
                  selectedTests={selectedTests}
                  onTestToggle={handleTestToggle}
                  onSelectAll={handleSelectAll}
                />
                <OtherTestsSection
                  value={otherTests}
                  onChange={setOtherTests}
                />
              </div>
              
              {/* Right Section - Print Preview */}
              <div className="lg:col-span-1">
                <PrintPreview
                  selectedTests={selectedTests}
                  otherTests={otherTests}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabRequestLayout;