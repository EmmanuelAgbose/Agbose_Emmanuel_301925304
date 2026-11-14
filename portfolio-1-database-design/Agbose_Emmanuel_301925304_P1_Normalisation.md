# Hospital / Clinic System — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| appointment_id | appointment_event records (list) |
| --- | --- |
| 301 | [401] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| appointment_event.event_id | appointment_event.appointment_id | appointment_event.event_type | appointment.appointment_id | appointment.patient_id | appointment.clinician_id | appointment.status | patient.patient_id |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 401 | 301 | appointment_created | 301 | 101 | 201 | scheduled | 101 |

Key: event_id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## appointment_event_example

| appointment_event.event_id | appointment_event.appointment_id | appointment_event.event_type | appointment.appointment_id | appointment.patient_id | appointment.clinician_id | appointment.status | patient.patient_id |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 401 | 301 | appointment_created | 301 | 101 | 201 | scheduled | 101 |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## patient

| patient_id | given_name | family_name | date_of_birth | phone |
| --- | --- | --- | --- | --- |
| 101 | Avery | Morgan | 1988-04-12 | NULL |

## clinician

| clinician_id | display_name | specialty | active |
| --- | --- | --- | --- |
| 201 | Jordan Lee | Family Medicine | true |

## appointment

| appointment_id | patient_id | clinician_id | starts_at | ends_at | status | room |
| --- | --- | --- | --- | --- | --- | --- |
| 301 | 101 | 201 | 2026-11-16T09:00:00+00:00 | 2026-11-16T09:30:00+00:00 | scheduled | Room 2 |

## appointment_event

| event_id | appointment_id | occurred_at | event_type | actor_role | details |
| --- | --- | --- | --- | --- | --- |
| 401 | 301 | 2026-11-14T12:00:00+00:00 | appointment_created | scheduler | NULL |

## Dependencies

- patient: (patient_id) → given_name, family_name, date_of_birth, phone
- clinician: (clinician_id) → display_name, specialty, active
- appointment: (appointment_id) → patient_id, clinician_id, starts_at, ends_at, status, room
- appointment_event: (event_id) → appointment_id, occurred_at, event_type, actor_role, details

Joining the decomposed sample tables reproduces the original 1 example rows. The design assumes the declared keys describe the relevant business dependencies.
