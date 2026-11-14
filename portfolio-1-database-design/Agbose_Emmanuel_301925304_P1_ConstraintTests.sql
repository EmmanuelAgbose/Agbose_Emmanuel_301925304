-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. reject patient pk. Expected: pk_patient, SQLSTATE 23505.
INSERT INTO portfolio."patient" ("patient_id", "given_name", "family_name", "date_of_birth", "phone")
VALUES (101, 'Casey', 'Taylor', '1991-07-08', NULL);

-- 2. reject patient given name null. Expected: given_name, SQLSTATE 23502.
INSERT INTO portfolio."patient" ("patient_id", "given_name", "family_name", "date_of_birth", "phone")
VALUES (501, NULL, 'Taylor', '1991-07-08', NULL);

-- 3. reject clinician pk. Expected: pk_clinician, SQLSTATE 23505.
INSERT INTO portfolio."clinician" ("clinician_id", "display_name", "specialty", "active")
VALUES (201, 'Riley Chen', 'Dermatology', TRUE);

-- 4. reject appointment pk. Expected: pk_appointment, SQLSTATE 23505.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "starts_at", "ends_at", "status", "room")
VALUES (301, 101, 201, '2026-11-17T09:00:00Z', '2026-11-17T09:30:00Z', 'scheduled', 'Room 3');

-- 5. reject appointment unique slot. Expected: uq_appointment_0, SQLSTATE 23505.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "starts_at", "ends_at", "status", "room")
VALUES (502, 101, 201, '2026-11-16T09:00:00Z', '2026-11-16T09:20:00Z', 'scheduled', 'Room 4');

-- 6. reject appointment patient fk. Expected: fk_appointment_0, SQLSTATE 23503.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "starts_at", "ends_at", "status", "room")
VALUES (503, 99001, 201, '2026-11-18T10:00:00Z', '2026-11-18T10:30:00Z', 'scheduled', NULL);

-- 7. reject appointment clinician fk. Expected: fk_appointment_1, SQLSTATE 23503.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "starts_at", "ends_at", "status", "room")
VALUES (504, 101, 99002, '2026-11-18T11:00:00Z', '2026-11-18T11:30:00Z', 'scheduled', NULL);

-- 8. reject appointment time order. Expected: appointment_time_order, SQLSTATE 23514.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "starts_at", "ends_at", "status", "room")
VALUES (505, 101, 201, '2026-11-19T10:30:00Z', '2026-11-19T10:00:00Z', 'scheduled', NULL);

-- 9. reject appointment status. Expected: appointment_status_values, SQLSTATE 23514.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "starts_at", "ends_at", "status", "room")
VALUES (506, 101, 201, '2026-11-19T11:00:00Z', '2026-11-19T11:30:00Z', 'pending', NULL);

-- 10. reject event pk. Expected: pk_appointment_event, SQLSTATE 23505.
INSERT INTO portfolio."appointment_event" ("event_id", "appointment_id", "occurred_at", "event_type", "actor_role", "details")
VALUES (401, 301, '2026-11-14T12:15:00Z', 'status_changed', 'scheduler', NULL);

-- 11. reject event appointment fk. Expected: fk_appointment_event_0, SQLSTATE 23503.
INSERT INTO portfolio."appointment_event" ("event_id", "appointment_id", "occurred_at", "event_type", "actor_role", "details")
VALUES (507, 99003, '2026-11-14T12:30:00Z', 'reminder_sent', 'scheduler', NULL);
