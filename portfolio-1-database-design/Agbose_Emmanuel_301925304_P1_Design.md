# Hospital / Clinic System — database design

My case study records patient, clinician, appointment, appointment_event.

## Users

- Clinic schedulers create and review appointments.
- Clinicians review appointments and associated events.

## Main operations

- Register synthetic patients and clinicians.
- Schedule appointments and record appointment events.
- Review appointments by date and summarize activity.

## Entities

| Entity | Information stored |
| --- | --- |
| patient | Stores synthetic patient identity and contact attributes. |
| clinician | Stores synthetic clinician display and specialty information. |
| appointment | Connects one patient and one clinician to a scheduled visit. |
| appointment_event | Records a timestamped event associated with an appointment. |

## patient

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| patient_id | BIGINT | PK | Yes |
| given_name | TEXT |  | Yes |
| family_name | TEXT |  | Yes |
| date_of_birth | DATE |  | Yes |
| phone | TEXT |  | No |


## clinician

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| clinician_id | BIGINT | PK | Yes |
| display_name | TEXT |  | Yes |
| specialty | TEXT |  | Yes |
| active | BOOLEAN |  | Yes |


## appointment

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| appointment_id | BIGINT | PK | Yes |
| patient_id | BIGINT | FK | Yes |
| clinician_id | BIGINT | FK | Yes |
| starts_at | TIMESTAMPTZ |  | Yes |
| ends_at | TIMESTAMPTZ |  | Yes |
| status | TEXT |  | Yes |
| room | TEXT |  | No |
- patient_id → patient.patient_id
- clinician_id → clinician.clinician_id
- Unique key: (clinician_id, starts_at).

## appointment_event

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| event_id | BIGINT | PK | Yes |
| appointment_id | BIGINT | FK | Yes |
| occurred_at | TIMESTAMPTZ |  | Yes |
| event_type | TEXT |  | Yes |
| actor_role | TEXT |  | Yes |
| details | TEXT |  | No |
- appointment_id → appointment.appointment_id

## Relationships and business rules

- An appointment must end after it starts.
- Appointment status must be scheduled, checked_in, completed, or cancelled.
- A clinician may have at most one appointment with any exact start timestamp.
- Every appointment must reference an existing patient.
- Every appointment must reference an existing clinician.
- Every appointment event must reference an existing appointment.

## Assumptions

- All data is synthetic, and appointment timestamps use UTC.
- For a normalization example, start with an appointment_event record containing appointment descriptive details. Keep values atomic, then separate appointment details into appointment and retain appointment_id as the event's foreign key. The resulting dependencies are event_id to event attributes and appointment_id to appointment attributes; appointment is the sole ancestor role in this example.
- The scheduling rule prevents two appointments for the same clinician from having the exact same start timestamp. Preventing other time-interval overlaps is out of scope.

