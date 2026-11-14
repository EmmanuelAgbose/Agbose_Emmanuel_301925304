-- Fictional sample records for Hospital / Clinic System.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."patient" ("patient_id", "given_name", "family_name", "date_of_birth", "phone") VALUES (101, 'Avery', 'Morgan', '1988-04-12', NULL);
INSERT INTO portfolio."clinician" ("clinician_id", "display_name", "specialty", "active") VALUES (201, 'Jordan Lee', 'Family Medicine', TRUE);
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "starts_at", "ends_at", "status", "room") VALUES (301, 101, 201, '2026-11-16T09:00:00Z', '2026-11-16T09:30:00Z', 'scheduled', 'Room 2');
INSERT INTO portfolio."appointment_event" ("event_id", "appointment_id", "occurred_at", "event_type", "actor_role", "details") VALUES (401, 301, '2026-11-14T12:00:00Z', 'appointment_created', 'scheduler', NULL);
COMMIT;
