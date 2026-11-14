-- Hospital / Clinic System: tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."patient" (
  "patient_id" bigint NOT NULL,
  "given_name" text NOT NULL,
  "family_name" text NOT NULL,
  "date_of_birth" date NOT NULL,
  "phone" text,
  CONSTRAINT "pk_patient" PRIMARY KEY ("patient_id")
);
CREATE TABLE portfolio."clinician" (
  "clinician_id" bigint NOT NULL,
  "display_name" text NOT NULL,
  "specialty" text NOT NULL,
  "active" boolean NOT NULL,
  CONSTRAINT "pk_clinician" PRIMARY KEY ("clinician_id")
);
CREATE TABLE portfolio."appointment" (
  "appointment_id" bigint NOT NULL,
  "patient_id" bigint NOT NULL,
  "clinician_id" bigint NOT NULL,
  "starts_at" timestamptz NOT NULL,
  "ends_at" timestamptz NOT NULL,
  "status" text NOT NULL,
  "room" text,
  CONSTRAINT "pk_appointment" PRIMARY KEY ("appointment_id"),
  CONSTRAINT "uq_appointment_0" UNIQUE ("clinician_id", "starts_at")
);
CREATE TABLE portfolio."appointment_event" (
  "event_id" bigint NOT NULL,
  "appointment_id" bigint NOT NULL,
  "occurred_at" timestamptz NOT NULL,
  "event_type" text NOT NULL,
  "actor_role" text NOT NULL,
  "details" text,
  CONSTRAINT "pk_appointment_event" PRIMARY KEY ("event_id")
);
ALTER TABLE portfolio."appointment" ADD CONSTRAINT "fk_appointment_0" FOREIGN KEY ("patient_id") REFERENCES portfolio."patient" ("patient_id");
ALTER TABLE portfolio."appointment" ADD CONSTRAINT "fk_appointment_1" FOREIGN KEY ("clinician_id") REFERENCES portfolio."clinician" ("clinician_id");
ALTER TABLE portfolio."appointment_event" ADD CONSTRAINT "fk_appointment_event_0" FOREIGN KEY ("appointment_id") REFERENCES portfolio."appointment" ("appointment_id");
ALTER TABLE portfolio."appointment" ADD CONSTRAINT "appointment_time_order" CHECK ("ends_at" > "starts_at");
ALTER TABLE portfolio."appointment" ADD CONSTRAINT "appointment_status_values" CHECK (("status" = 'scheduled') OR ("status" = 'checked_in') OR ("status" = 'completed') OR ("status" = 'cancelled'));
COMMIT;
