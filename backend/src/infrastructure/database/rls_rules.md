| Table | Permissions |
|-------|-------------|
| **users / doctors / admins / receptionists** | Admin: CRUD all |
| **patients** | Admin: CRUD all<br>Doctor: CRUD own assigned patients |
| **rooms** | Admin: CRUD all<br>Receptionist: CRUD all |
| **appointments** | Admin: CRUD all<br>Receptionist: CRUD all<br>Doctor: Create, read/delete own |
| **patient_medical_files** | Admin: CRUD all<br>Doctor: Read own patients' files |
| **appointment_results** | Admin: CRUD all<br>Doctor: Read own patients' results |
