// frontend/src/app/prescriptions/components/PrescriptionsLayout.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../dashboard/components/Sidebar';
import Topbar from '../../machines/components/Topbar';
import PrescriptionsHeader from './PrescriptionsHeader';
import PatientInfoSection from './PatientInfoSection';
import PharmacyMedicationsInfo from './PharmacyMedicationsInfo';
import PrescriptionDetailsTable from './PrescriptionDetailsTable';
import PrescriptionPrintPreview from './PrescriptionPrintPreview';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

interface PrescriptionState {
  medications: Medication[];
  savedAt?: string;
}

const PrescriptionsLayout: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      notes: ''
    }
  ]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track unsaved changes
  useEffect(() => {
    const hasContent = medications.some(
      med => med.name || med.dosage || med.frequency || med.duration || med.notes
    );
    setHasUnsavedChanges(hasContent);
  }, [medications]);

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

  const handleAddMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      notes: ''
    };
    setMedications([...medications, newMedication]);
  };

  const handleRemoveMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const handleUpdateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med =>
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleClearAll = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Are you sure you want to clear all? All unsaved changes will be lost.')) {
        setMedications([{
          id: Date.now().toString(),
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          notes: ''
        }]);
        localStorage.removeItem('prescription_draft');
        setHasUnsavedChanges(false);
      }
    }
  };

  const handleSave = () => {
    const prescription: PrescriptionState = {
      medications: medications.filter(med => med.name.trim() !== ''),
      savedAt: new Date().toISOString()
    };

    console.log('Saving prescription...', prescription);
    
    // TODO: Replace with actual API call
    // await api.savePrescription(prescription);
    
    // Save to localStorage as backup
    localStorage.setItem('prescription_draft', JSON.stringify(prescription));
    
    alert('Prescription saved successfully!');
    setHasUnsavedChanges(false);
  };

  const handlePrintRequestForm = () => {
    const filledMedications = medications.filter(med => med.name.trim() !== '');
    
    if (filledMedications.length === 0) {
      alert('Please add at least one medication before printing.');
      return;
    }
    
    if (hasUnsavedChanges) {
      const shouldSave = window.confirm('Would you like to save before printing?');
      if (shouldSave) {
        handleSave();
      }
    }
    
    window.print();
  };

  const handlePrintPrescription = () => {
    handlePrintRequestForm();
  };

  const handleReuseLastPrescription = () => {
    const lastPrescription = localStorage.getItem('prescription_draft');
    if (lastPrescription) {
      try {
        const parsed: PrescriptionState = JSON.parse(lastPrescription);
        if (parsed.medications && parsed.medications.length > 0) {
          const shouldLoad = window.confirm('Load the last saved prescription?');
          if (shouldLoad) {
            setMedications(parsed.medications);
          }
        } else {
          alert('No previous prescription found.');
        }
      } catch (error) {
        console.error('Failed to load prescription:', error);
        alert('Failed to load previous prescription.');
      }
    } else {
      alert('No previous prescription found.');
    }
  };

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('prescription_draft');
    if (draft) {
      try {
        const parsed: PrescriptionState = JSON.parse(draft);
        const shouldLoad = window.confirm('A draft prescription was found. Would you like to load it?');
        if (shouldLoad) {
          setMedications(parsed.medications || []);
        } else {
          localStorage.removeItem('prescription_draft');
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
        localStorage.removeItem('prescription_draft');
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
            <PrescriptionsHeader 
              medications={medications}
              onClearAll={handleClearAll}
              onSave={handleSave}
              onPrintRequestForm={handlePrintRequestForm}
              onPrintPrescription={handlePrintPrescription}
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
                <PharmacyMedicationsInfo />
                <PrescriptionDetailsTable
                  medications={medications}
                  onAddMedication={handleAddMedication}
                  onRemoveMedication={handleRemoveMedication}
                  onUpdateMedication={handleUpdateMedication}
                  onReuseLastPrescription={handleReuseLastPrescription}
                />
              </div>
              
              {/* Right Section - Print Preview */}
              <div className="lg:col-span-1">
                <PrescriptionPrintPreview medications={medications} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionsLayout;