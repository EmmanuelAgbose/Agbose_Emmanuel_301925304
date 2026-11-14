// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("appointment_records")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("appointment_records", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "appointment_created",
                    "status_changed"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "appointment_event"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "event_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("appointment_records").insertMany([
    {
        "_id": "event_000001",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "appointment_created",
        "occurredAt": ISODate("2030-01-01T10:00:00Z"),
        "source": {
            "entity": "appointment_event",
            "key": {
                "event_id": 401
            },
            "snapshot": {
                "event_id": 401,
                "appointment_id": 301,
                "occurred_at": "2026-11-14T12:00:00Z",
                "event_type": "appointment_created",
                "actor_role": "scheduler",
                "details": null
            }
        },
        "embedded": {
            "patient": [
                {
                    "key": {
                        "patient_id": 101
                    },
                    "snapshot": {
                        "patient_id": 101,
                        "given_name": "Avery",
                        "family_name": "Morgan",
                        "date_of_birth": "1988-04-12",
                        "phone": null
                    },
                    "via": [
                        "appointment_event.appointment_id → appointment.patient_id → patient"
                    ]
                }
            ],
            "clinician": [
                {
                    "key": {
                        "clinician_id": 201
                    },
                    "snapshot": {
                        "clinician_id": 201,
                        "display_name": "Jordan Lee",
                        "specialty": "Family Medicine",
                        "active": true
                    },
                    "via": [
                        "appointment_event.appointment_id → appointment.clinician_id → clinician"
                    ]
                }
            ]
        },
        "references": {
            "appointment": [
                {
                    "key": {
                        "appointment_id": 301
                    },
                    "via": [
                        "appointment_event.appointment_id → appointment"
                    ]
                }
            ]
        },
        "details": {
            "channel": "web"
        }
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "status_changed",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
        "source": {
            "entity": "appointment_event",
            "key": {
                "event_id": 401
            },
            "snapshot": {
                "event_id": 401,
                "appointment_id": 301,
                "occurred_at": "2026-11-14T12:00:00Z",
                "event_type": "appointment_created",
                "actor_role": "scheduler",
                "details": null
            }
        },
        "embedded": {
            "patient": [
                {
                    "key": {
                        "patient_id": 101
                    },
                    "snapshot": {
                        "patient_id": 101,
                        "given_name": "Avery",
                        "family_name": "Morgan",
                        "date_of_birth": "1988-04-12",
                        "phone": null
                    },
                    "via": [
                        "appointment_event.appointment_id → appointment.patient_id → patient"
                    ]
                }
            ],
            "clinician": [
                {
                    "key": {
                        "clinician_id": 201
                    },
                    "snapshot": {
                        "clinician_id": 201,
                        "display_name": "Jordan Lee",
                        "specialty": "Family Medicine",
                        "active": true
                    },
                    "via": [
                        "appointment_event.appointment_id → appointment.clinician_id → clinician"
                    ]
                }
            ]
        },
        "references": {
            "appointment": [
                {
                    "key": {
                        "appointment_id": 301
                    },
                    "via": [
                        "appointment_event.appointment_id → appointment"
                    ]
                }
            ]
        },
        "details": {
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "appointment_event",
                    "key": {
                        "event_id": 401
                    },
                    "field": "details",
                    "value": null
                }
            ],
            "examples": {
                "metadata": "illustrative metadata",
                "reminder_channel": "illustrative reminder_channel"
            }
        }
    }
]));
  await db.getCollection("appointment_records").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("appointment_records").find({"eventType":"appointment_created"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("appointment_records").find({"source.key.event_id":401}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("appointment_records").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("appointment_records").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("appointment_records").insertOne({...{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "appointment_created",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "appointment_event",
        "key": {
            "event_id": 401
        },
        "snapshot": {
            "event_id": 401,
            "appointment_id": 301,
            "occurred_at": "2026-11-14T12:00:00Z",
            "event_type": "appointment_created",
            "actor_role": "scheduler",
            "details": null
        }
    },
    "embedded": {
        "patient": [
            {
                "key": {
                    "patient_id": 101
                },
                "snapshot": {
                    "patient_id": 101,
                    "given_name": "Avery",
                    "family_name": "Morgan",
                    "date_of_birth": "1988-04-12",
                    "phone": null
                },
                "via": [
                    "appointment_event.appointment_id → appointment.patient_id → patient"
                ]
            }
        ],
        "clinician": [
            {
                "key": {
                    "clinician_id": 201
                },
                "snapshot": {
                    "clinician_id": 201,
                    "display_name": "Jordan Lee",
                    "specialty": "Family Medicine",
                    "active": true
                },
                "via": [
                    "appointment_event.appointment_id → appointment.clinician_id → clinician"
                ]
            }
        ]
    },
    "references": {
        "appointment": [
            {
                "key": {
                    "appointment_id": 301
                },
                "via": [
                    "appointment_event.appointment_id → appointment"
                ]
            }
        ]
    },
    "details": {
        "channel": "web"
    }
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("appointment_records").insertOne({
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "appointment_created",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "appointment_event",
        "key": {
            "event_id": 401
        },
        "snapshot": {
            "event_id": 401,
            "appointment_id": 301,
            "occurred_at": "2026-11-14T12:00:00Z",
            "event_type": "appointment_created",
            "actor_role": "scheduler",
            "details": null
        }
    },
    "embedded": {
        "patient": [
            {
                "key": {
                    "patient_id": 101
                },
                "snapshot": {
                    "patient_id": 101,
                    "given_name": "Avery",
                    "family_name": "Morgan",
                    "date_of_birth": "1988-04-12",
                    "phone": null
                },
                "via": [
                    "appointment_event.appointment_id → appointment.patient_id → patient"
                ]
            }
        ],
        "clinician": [
            {
                "key": {
                    "clinician_id": 201
                },
                "snapshot": {
                    "clinician_id": 201,
                    "display_name": "Jordan Lee",
                    "specialty": "Family Medicine",
                    "active": true
                },
                "via": [
                    "appointment_event.appointment_id → appointment.clinician_id → clinician"
                ]
            }
        ]
    },
    "references": {
        "appointment": [
            {
                "key": {
                    "appointment_id": 301
                },
                "via": [
                    "appointment_event.appointment_id → appointment"
                ]
            }
        ]
    },
    "details": {
        "channel": "web"
    }
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("appointment_records").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
