# API Data Format Reference

Quick reference for backend developers showing request/response formats.

**Important:** All examples below show the actual data structure. The backend MUST wrap all responses in the standardized format shown in the "Response Format" section.

**ID Types:**

- Patient ID: `number` (integer)
- Doctor ID: `number` (integer)
- Appointment ID: `number` (integer)

---

## Response Format

All API responses follow this standardized format:

### Success Response

```json
{
  "success": true,
  "status": 200,
  "data": {
    /* actual response data */
  },
  "error": null
}
```

### Error Response

```json
{
  "success": false,
  "status": 400,
  "data": null,
  "error": {
    "type": "ValidationError",
    "subErrorType": "InvalidField",
    "context": { "field": "email" },
    "message": "Invalid email format",
    "details": "The email address provided is not valid",
    "hint": "Please provide a valid email address"
  }
}
```

**Note:** The frontend axios interceptor automatically unwraps successful responses, so API functions receive the `data` field directly.

---

## Patients

### GET /patients

**Success Response Data (array):**

```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1-555-123-4567",
    "address": "123 Main St",
    "profession": "Engineer",
    "childrenNumber": 2,
    "familySituation": "Married",
    "birthDate": "1985-03-15",
    "gender": "Male",
    "insuranceNumber": "INS-123456789",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+1-555-987-6543",
    "allergies": ["Penicillin"],
    "currentMedications": ["Lisinopril 10mg"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### GET /patients/:id

**Success Response Data (single object):** Same format as above, single object instead of array.

### POST /patients

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1-555-123-4567",
  "birthDate": "1985-03-15",
  "gender": "Male",
  "address": "123 Main St",
  "profession": "Engineer",
  "childrenNumber": 2,
  "familySituation": "Married",
  "insuranceNumber": "INS-123456789",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1-555-987-6543",
  "allergies": ["Penicillin"],
  "currentMedications": ["Lisinopril 10mg"]
}
```

**Success Response Data:** Returns created patient object (same format as GET).

### PUT /patients/:id

ID in URL. Request body same as POST. All fields optional.

**Success Response Data:** Returns updated patient object.

### DELETE /patients/:id

No body.

**Success Response:** `{"success": true, "status": 200, "data": {"message": "Patient deleted successfully"}, "error": null}`

---

## Doctors

**Note:** Backend must join `doctors` table with `profiles` table using `user_id` FK.

### GET /doctors

**Success Response Data (array):**

```json
[
  {
    "id": 1,
    "firstName": "Ahmed",
    "lastName": "Benali",
    "email": "ahmed.benali@clinic.dz",
    "phoneNumber": "+213 555 123 456",
    "specialization": "Nephrology",
    "salary": 150000,
    "isMedicalDirector": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### GET /doctors/:id

**Success Response Data (single object):** Same format as above, single object instead of array.

### POST /doctors

**Request Body:**

```json
{
  "firstName": "Ahmed",
  "lastName": "Benali",
  "email": "ahmed.benali@clinic.dz",
  "phoneNumber": "+213 555 123 456",
  "specialization": "Nephrology",
  "salary": 150000,
  "isMedicalDirector": true
}
```

**Success Response Data:** Returns created doctor object (same format as GET).

### PUT /doctors/:id

ID in URL. Request body same as POST. All fields optional.

**Success Response Data:** Returns updated doctor object.

### DELETE /doctors/:id

No body.

**Success Response:** `{"success": true, "status": 200, "data": {"message": "Doctor deleted successfully"}, "error": null}`

---

## Appointments

### GET /appointments

**Success Response Data (array):**

```json
[
  {
    "id": 1,
    "patientId": 1,
    "doctorId": 2,
    "roomId": 101,
    "createdByReceptionistId": "uuid-string",
    "createdByDoctorId": "uuid-string",
    "appointmentDate": "2024-03-20T10:00:00Z",
    "estimatedDuration": 60,
    "actualDuration": 55,
    "status": "completed",
    "notes": "Regular checkup",
    "reasonForVisit": "Annual physical",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

**Status values:** `"scheduled"` | `"in-progress"` | `"completed"` | `"cancelled"` | `"no-show"`

### GET /appointments/:id

**Success Response Data (single object):** Same format as above, single object instead of array.

### POST /appointments

**Request Body:**

```json
{
  "patientId": 1,
  "doctorId": 2,
  "roomId": 101,
  "appointmentDate": "2024-03-20T10:00:00Z",
  "estimatedDuration": 60,
  "status": "scheduled",
  "reasonForVisit": "Annual physical",
  "notes": "Patient prefers morning appointments"
}
```

**Success Response Data:** Returns created appointment object (same format as GET).

### PUT /appointments/:id

ID in URL. Request body same as POST. All fields optional.

**Success Response Data:** Returns updated appointment object.

### DELETE /appointments/:id

No body.

**Success Response:** `{"success": true, "status": 200, "data": {"message": "Appointment deleted successfully"}, "error": null}`
