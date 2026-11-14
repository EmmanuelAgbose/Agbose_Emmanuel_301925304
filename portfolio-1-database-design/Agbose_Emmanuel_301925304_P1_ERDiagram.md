# Hospital / Clinic System — ER diagram

```mermaid
erDiagram
    direction LR
    patient {
        bigint patient_id PK
        text given_name
        text family_name
        date date_of_birth
        text phone "Optional"
    }
    clinician {
        bigint clinician_id PK
        text display_name
        text specialty
        boolean active
    }
    appointment {
        bigint appointment_id PK
        bigint patient_id FK
        bigint clinician_id FK
        timestamptz starts_at
        timestamptz ends_at
        text status
        text room "Optional"
    }
    appointment_event {
        bigint event_id PK
        bigint appointment_id FK
        timestamptz occurred_at
        text event_type
        text actor_role
        text details "Optional"
    }
    patient ||--o{ appointment : "patient_id"
    clinician ||--o{ appointment : "clinician_id"
    appointment ||--o{ appointment_event : "appointment_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Agbose_Emmanuel_301925304_ERDiagram.png)
