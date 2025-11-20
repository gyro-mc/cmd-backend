-- =========================
-- 1️⃣ Create Role Enum
-- =========================
CREATE TYPE role_enum AS ENUM ('admin', 'doctor', 'receptionist');

-- =========================
-- 2️⃣ Profiles Table (replaces users + roles)
-- =========================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role role_enum NOT NULL DEFAULT 'doctor',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- =========================
-- 3️⃣ Role-specific Tables
-- =========================
-- Doctor
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    salary DECIMAL(10,2),
    is_medical_director BOOLEAN DEFAULT FALSE,
    specialization VARCHAR(255),
    license_number VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);

CREATE TRIGGER trg_doctors_updated_at
BEFORE UPDATE ON doctors
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- Receptionist
CREATE TABLE IF NOT EXISTS receptionists (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    phone_number VARCHAR(20),
    department VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_receptionists_updated_at
BEFORE UPDATE ON receptionists
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- Patient
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    address TEXT,
    phone_number VARCHAR(20),
    profession TEXT,
    children_number INTEGER DEFAULT 0,
    family_situation TEXT,
    birth_date DATE,
    gender VARCHAR(20),
    insurance_number VARCHAR(100),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    allergies TEXT[],
    current_medications TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone_number);
CREATE INDEX IF NOT EXISTS idx_patients_insurance ON patients(insurance_number);

CREATE TRIGGER trg_patients_updated_at
BEFORE UPDATE ON patients
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- =========================
-- 4️⃣ Rooms
-- =========================
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(50) UNIQUE NOT NULL,
    capacity INTEGER DEFAULT 1,
    type VARCHAR(50) DEFAULT 'consultation',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rooms_available ON rooms(is_available);

CREATE TRIGGER trg_rooms_updated_at
BEFORE UPDATE ON rooms
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- =========================
-- 5️⃣ Patient Medical Files
-- =========================
CREATE TABLE IF NOT EXISTS patient_medical_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    blood_type VARCHAR(10),
    height DECIMAL(5,2),
    weight DECIMAL(6,2),
    chronic_conditions TEXT[],
    surgical_history TEXT[],
    family_medical_history TEXT,
    current_medications JSONB,
    allergies TEXT[],
    attributes JSONB,
    current_treatment TEXT[],
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medical_file_patient ON patient_medical_files(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_file_doctor ON patient_medical_files(doctor_id);

CREATE TRIGGER trg_medical_files_updated_at
BEFORE UPDATE ON patient_medical_files
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- =========================
-- 6️⃣ Appointments
-- =========================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE SET NULL,
    room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
    created_by_receptionist_id UUID REFERENCES receptionists(id) ON DELETE SET NULL,
    created_by_doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    appointment_date TIMESTAMPTZ NOT NULL,
    estimated_duration INTEGER DEFAULT 30,
    actual_duration INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled', 'no-show')),
    notes TEXT,
    reason_for_visit VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (
        (created_by_receptionist_id IS NOT NULL AND created_by_doctor_id IS NULL) OR
        (created_by_receptionist_id IS NULL AND created_by_doctor_id IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_room ON appointments(room_id);

CREATE TRIGGER trg_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- =========================
-- 7️⃣ Appointment Results
-- =========================
CREATE TABLE IF NOT EXISTS appointment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    patient_medical_file_id UUID NOT NULL REFERENCES patient_medical_files(id) ON DELETE CASCADE,
    description TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    prescription JSONB,
    updated_attributes JSONB,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_results_appointment ON appointment_results(appointment_id);
CREATE INDEX IF NOT EXISTS idx_results_medical_file ON appointment_results(patient_medical_file_id);

CREATE TRIGGER trg_appointment_results_updated_at
BEFORE UPDATE ON appointment_results
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();
