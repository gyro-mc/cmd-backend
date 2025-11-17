-- =========================
-- 1️⃣ Roles Table
-- =========================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('admin', 'Administrator with full access'),
    ('doctor', 'Medical doctor'),
    ('receptionist', 'Front desk receptionist'),
    ('patient', 'Patient') ON CONFLICT (name) DO NOTHING;

-- =========================
-- 2️⃣ Users Table
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- =========================
-- 3️⃣ Role-specific Tables
-- =========================

-- Admin
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_admins_updated_at
BEFORE UPDATE ON admins
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Doctor
CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    salary DECIMAL(10,2),
    is_medical_director BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_doctors_updated_at
BEFORE UPDATE ON doctors
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Receptionist
CREATE TABLE IF NOT EXISTS receptionists (
    id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_receptionists_updated_at
BEFORE UPDATE ON receptionists
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Patient
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    address TEXT,
    phone_number VARCHAR(20),
    profession TEXT,
    children_number INTEGER DEFAULT 0,
    family_situation TEXT,
    birth_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_patients_updated_at
BEFORE UPDATE ON patients
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================
-- 4️⃣ Rooms
-- =========================
CREATE TABLE IF NOT EXISTS rooms (
    room_number SERIAL PRIMARY KEY,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_rooms_updated_at
BEFORE UPDATE ON rooms
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================
-- 5️⃣ Patient Medical File
-- =========================
CREATE TABLE IF NOT EXISTS patient_medical_files (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    attributes JSONB,
    current_treatment TEXT[],
    last_updated TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_medical_file_patient ON patient_medical_files(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_file_doctor ON patient_medical_files(doctor_id);

-- =========================
-- 6️⃣ Appointments
-- =========================
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by_receptionist_id INTEGER REFERENCES receptionists(id) ON DELETE SET NULL,
    created_by_doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
    appointment_date TIMESTAMP NOT NULL,
    estimated_duration INTEGER,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    room_number INTEGER REFERENCES rooms(room_number) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
    updated_at TIMESTAMP DEFAULT NOW(),
    CHECK (
        (created_by_receptionist_id IS NOT NULL AND created_by_doctor_id IS NULL) OR
        (created_by_receptionist_id IS NULL AND created_by_doctor_id IS NOT NULL)
    )
);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Trigger for updated_at
CREATE TRIGGER trg_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================
-- 7️⃣ Appointment Results
-- =========================
CREATE TABLE IF NOT EXISTS appointment_results (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    patient_medical_file_id INTEGER REFERENCES patient_medical_files(id) ON DELETE CASCADE,
    description TEXT,
    updated_attributes JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_appointment_results_updated_at
BEFORE UPDATE ON appointment_results
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
