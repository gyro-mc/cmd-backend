-- =========================
-- Enable RLS on all tables
-- =========================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE receptionists ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medical_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_results ENABLE ROW LEVEL SECURITY;

-- =========================
-- Helper Function: Get User Role
-- =========================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
    role_name TEXT;
BEGIN
    SELECT role::TEXT INTO role_name
    FROM profiles
    WHERE id = auth.uid();
    RETURN COALESCE(role_name, 'patient');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================
-- Helper Function: Check if user is admin
-- =========================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================
-- Helper Function: Check if user is doctor
-- =========================
CREATE OR REPLACE FUNCTION is_doctor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'doctor';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================
-- Helper Function: Check if user is receptionist
-- =========================
CREATE OR REPLACE FUNCTION is_receptionist()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'receptionist';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================
-- PROFILES TABLE RLS
-- =========================
-- Users can view their own profile
CREATE POLICY profiles_select_own ON profiles
    FOR SELECT
    USING (auth.uid() = id OR is_admin());

-- Admin can CRUD all profiles
CREATE POLICY profiles_admin_crud ON profiles
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Users can UPDATE their own profile
CREATE POLICY profiles_update_own ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- =========================
-- DOCTORS TABLE RLS
-- =========================
-- Doctors can view their own profile
CREATE POLICY doctors_select_own ON doctors
    FOR SELECT
    USING (auth.uid() = id OR is_admin());

-- Admin can CRUD all doctors
CREATE POLICY doctors_admin_crud ON doctors
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Doctors can UPDATE their own profile
CREATE POLICY doctors_update_own ON doctors
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- =========================
-- RECEPTIONISTS TABLE RLS
-- =========================
-- Receptionists can view their own profile
CREATE POLICY receptionists_select_own ON receptionists
    FOR SELECT
    USING (auth.uid() = id OR is_admin());

-- Admin can CRUD all receptionists
CREATE POLICY receptionists_admin_crud ON receptionists
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Receptionists can UPDATE their own profile
CREATE POLICY receptionists_update_own ON receptionists
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- =========================
-- PATIENTS TABLE RLS
-- =========================
-- Admin can CRUD all patients
CREATE POLICY patients_admin_crud ON patients
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Doctors can view their assigned patients
CREATE POLICY patients_select_assigned_to_doctor ON patients
    FOR SELECT
    USING (
        is_doctor() AND 
        EXISTS (
            SELECT 1 FROM appointments
            WHERE appointments.patient_id = patients.id
            AND appointments.doctor_id = auth.uid()
        )
    );

-- Receptionists can view all patients (to schedule appointments)
CREATE POLICY patients_select_receptionist ON patients
    FOR SELECT
    USING (is_receptionist());

-- =========================
-- ROOMS TABLE RLS
-- =========================
-- Admin can CRUD rooms
CREATE POLICY rooms_admin_crud ON rooms
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Receptionists can CRUD rooms
CREATE POLICY rooms_receptionist_crud ON rooms
    FOR ALL
    USING (is_receptionist())
    WITH CHECK (is_receptionist());

-- Authenticated users can view rooms
CREATE POLICY rooms_select_all ON rooms
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- =========================
-- APPOINTMENTS TABLE RLS
-- =========================
-- Admin can CRUD all appointments
CREATE POLICY appointments_admin_crud ON appointments
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Receptionists can CRUD all appointments
CREATE POLICY appointments_receptionist_crud ON appointments
    FOR ALL
    USING (is_receptionist())
    WITH CHECK (is_receptionist());

-- Doctors can view their own appointments
CREATE POLICY appointments_doctor_select ON appointments
    FOR SELECT
    USING (is_doctor() AND doctor_id = auth.uid());

-- Doctors can update their own appointments
CREATE POLICY appointments_doctor_update ON appointments
    FOR UPDATE
    USING (is_doctor() AND doctor_id = auth.uid())
    WITH CHECK (is_doctor() AND doctor_id = auth.uid());

-- =========================
-- PATIENT_MEDICAL_FILES TABLE RLS
-- =========================
-- Admin can CRUD all medical files
CREATE POLICY medical_files_admin_crud ON patient_medical_files
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Doctors can view and manage their patients' medical files
CREATE POLICY medical_files_doctor_own_patients ON patient_medical_files
    FOR ALL
    USING (
        is_doctor() AND doctor_id = auth.uid()
    )
    WITH CHECK (
        is_doctor() AND doctor_id = auth.uid()
    );

-- Receptionists can view medical files
CREATE POLICY medical_files_receptionist_select ON patient_medical_files
    FOR SELECT
    USING (is_receptionist());

-- =========================
-- APPOINTMENT_RESULTS TABLE RLS
-- =========================
-- Admin can CRUD all appointment results
CREATE POLICY appointment_results_admin_crud ON appointment_results
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Doctors can view and update results for their appointments
CREATE POLICY appointment_results_doctor_own ON appointment_results
    FOR SELECT
    USING (
        is_doctor() AND 
        EXISTS (
            SELECT 1 FROM appointments a
            WHERE a.id = appointment_results.appointment_id
            AND a.doctor_id = auth.uid()
        )
    );

CREATE POLICY appointment_results_doctor_update ON appointment_results
    FOR UPDATE
    USING (
        is_doctor() AND 
        EXISTS (
            SELECT 1 FROM appointments a
            WHERE a.id = appointment_results.appointment_id
            AND a.doctor_id = auth.uid()
        )
    )
    WITH CHECK (
        is_doctor() AND 
        EXISTS (
            SELECT 1 FROM appointments a
            WHERE a.id = appointment_results.appointment_id
            AND a.doctor_id = auth.uid()
        )
    );

-- Receptionists can view appointment results
CREATE POLICY appointment_results_receptionist_select ON appointment_results
    FOR SELECT
    USING (is_receptionist());