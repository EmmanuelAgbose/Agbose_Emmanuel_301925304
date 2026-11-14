# Hospital / Clinic System — SQL queries

## 1. Show related appointment, patient, clinician records (up to 20).

```sql
SELECT t0."appointment_id" AS "appointment_appointment_id",
       t0."starts_at" AS "appointment_starts_at",
       t1."patient_id" AS "patient_patient_id",
       t1."given_name" AS "patient_given_name",
       t2."clinician_id" AS "clinician_clinician_id",
       t2."display_name" AS "clinician_display_name"
FROM portfolio."appointment" t0
JOIN portfolio."patient" t1 ON t0."patient_id" = t1."patient_id"
JOIN portfolio."clinician" t2 ON t0."clinician_id" = t2."clinician_id"
ORDER BY t0."appointment_id", t1."patient_id", t2."clinician_id"
LIMIT 20;
```

| appointment_appointment_id | appointment_starts_at | patient_patient_id | patient_given_name | clinician_clinician_id | clinician_display_name |
| --- | --- | --- | --- | --- | --- |
| 301 | 2026-11-16T09:00:00+00:00 | 101 | Avery | 201 | Jordan Lee |

## 2. Find appointment records where starts_at matches "2026-11-16T09:00:00Z" (up to 20).

```sql
SELECT * FROM portfolio."appointment"
WHERE "starts_at" IS NOT DISTINCT FROM '2026-11-16T09:00:00Z'
ORDER BY "appointment_id"
LIMIT 20;
```

| appointment_id | patient_id | clinician_id | starts_at | ends_at | status | room |
| --- | --- | --- | --- | --- | --- | --- |
| 301 | 101 | 201 | 2026-11-16T09:00:00+00:00 | 2026-11-16T09:30:00+00:00 | scheduled | Room 2 |

## 3. Count appointment records for each patient_id (up to 20 groups).

```sql
SELECT "patient_id", count(*) AS record_count
FROM portfolio."appointment"
GROUP BY "patient_id"
ORDER BY record_count DESC, "patient_id" NULLS LAST
LIMIT 20;
```

| patient_id | record_count |
| --- | --- |
| 101 | 1 |

## 4. Find appointment records where starts_at matches "2026-11-16T09:00:00Z" (up to 20).

```sql
SELECT * FROM portfolio."appointment"
WHERE "starts_at" IS NOT DISTINCT FROM '2026-11-16T09:00:00Z'
ORDER BY "appointment_id"
LIMIT 20;
```

| appointment_id | patient_id | clinician_id | starts_at | ends_at | status | room |
| --- | --- | --- | --- | --- | --- | --- |
| 301 | 101 | 201 | 2026-11-16T09:00:00+00:00 | 2026-11-16T09:30:00+00:00 | scheduled | Room 2 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 1.033 | 1.033, 0.971, 1.045 | Sort → Seq Scan | 112 |
| After index | 0.194 | 0.194, 0.193, 0.221 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 25 |

The median execution time changed from 1.033 ms to 0.194 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=1.004..1.005 rows=20 loops=1)
  Seq Scan on appointment (actual time=0.016..0.971 rows=20 loops=1)
Planning Time: 0.332 ms
Execution Time: 1.033 ms
```

### Before index, run 2

```text
Sort (actual time=0.944..0.945 rows=20 loops=1)
  Seq Scan on appointment (actual time=0.016..0.911 rows=20 loops=1)
Planning Time: 0.337 ms
Execution Time: 0.971 ms
```

### Before index, run 3

```text
Sort (actual time=0.988..0.989 rows=20 loops=1)
  Seq Scan on appointment (actual time=0.016..0.945 rows=20 loops=1)
Planning Time: 0.368 ms
Execution Time: 1.045 ms
```

### After index, run 1

```text
Sort (actual time=0.132..0.134 rows=20 loops=1)
  Bitmap Heap Scan on appointment (actual time=0.032..0.095 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.018..0.019 rows=20 loops=1)
Planning Time: 0.555 ms
Execution Time: 0.194 ms
```

### After index, run 2

```text
Sort (actual time=0.13..0.131 rows=20 loops=1)
  Bitmap Heap Scan on appointment (actual time=0.033..0.095 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.019..0.02 rows=20 loops=1)
Planning Time: 0.542 ms
Execution Time: 0.193 ms
```

### After index, run 3

```text
Sort (actual time=0.158..0.16 rows=20 loops=1)
  Bitmap Heap Scan on appointment (actual time=0.033..0.096 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.019..0.02 rows=20 loops=1)
Planning Time: 0.553 ms
Execution Time: 0.221 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Agbose_Emmanuel_301925304_P2_Queries.sql, then Agbose_Emmanuel_301925304_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Agbose_Emmanuel_301925304_P2_QueryResults.png) · [Index comparison](screenshots/Agbose_Emmanuel_301925304_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

