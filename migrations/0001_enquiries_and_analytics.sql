-- Enquiries are independent records, never part of an Admin content snapshot.
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS enquiries_created ON enquiries(deleted, created_at DESC);
CREATE TABLE IF NOT EXISTS enquiry_limits (
  id TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0
);

-- Each counter increment is atomic; a batch records all dimensions of one visit.
CREATE TABLE IF NOT EXISTS visit_counts (
  day TEXT NOT NULL,
  dimension TEXT NOT NULL,
  label TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, dimension, label)
);
CREATE TABLE IF NOT EXISTS visit_visitors (
  day TEXT NOT NULL,
  visitor TEXT NOT NULL,
  PRIMARY KEY (day, visitor)
);
