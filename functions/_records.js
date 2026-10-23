// Operational records live in D1; public content and media stay in the existing KV store.
function database(env) {
  if (!env.EBENTEE_RECORDS) throw new Error("Enquiry and analytics storage is not configured.");
  return env.EBENTEE_RECORDS;
}

export async function importLegacyLeads(env, leads = []) {
  if (!leads.length) return;
  const db = database(env);
  for (let start = 0; start < leads.length; start += 50) {
    await db.batch(leads.slice(start, start + 50).map((lead) => db.prepare(
      "INSERT OR IGNORE INTO enquiries (id, data, created_at) VALUES (?, ?, ?)"
    ).bind(lead.id, JSON.stringify(lead), lead.createdAt)));
  }
}

export async function listLeads(env, legacy = []) {
  await importLegacyLeads(env, legacy);
  const { results } = await database(env).prepare(
    "SELECT data, revision FROM enquiries WHERE deleted = 0 ORDER BY created_at DESC LIMIT 1000"
  ).all();
  return results.map((row) => ({ ...JSON.parse(row.data), revision: row.revision }));
}

export async function findLead(env, id) {
  const row = await database(env).prepare("SELECT data, revision, deleted FROM enquiries WHERE id = ?").bind(id).first();
  return row && !row.deleted ? { ...JSON.parse(row.data), revision: row.revision } : null;
}

export async function insertLead(env, lead) {
  const result = await database(env).prepare(
    "INSERT OR IGNORE INTO enquiries (id, data, created_at) VALUES (?, ?, ?)"
  ).bind(lead.id, JSON.stringify(lead), lead.createdAt).run();
  return result.meta.changes > 0;
}

export async function changeLead(env, id, revision, update, remove = false) {
  const db = database(env);
  const current = await findLead(env, id);
  if (!current) return { status: 404, error: "Enquiry not found." };
  const data = { ...current, ...update, updatedAt: new Date().toISOString() };
  const result = await db.prepare(
    "UPDATE enquiries SET data = ?, revision = revision + 1, deleted = ? WHERE id = ? AND revision = ? AND deleted = 0"
  ).bind(JSON.stringify(data), remove ? 1 : 0, id, revision).run();
  if (!result.meta.changes) return { status: 409, error: "This enquiry changed. Refresh before editing it again." };
  return { status: 200, lead: { ...data, revision: revision + 1 } };
}

// Reserve one attempt before doing the work, so parallel requests cannot all pass
// a check made before any of them is counted. Expired windows restart in place.
export async function reserveAttempt(env, id, max, windowSeconds, lockSeconds = windowSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const row = await database(env).prepare(
    `INSERT INTO enquiry_limits (id, attempts, expires_at) VALUES (?1, 1, ?2 + ?3)
     ON CONFLICT(id) DO UPDATE SET
       attempts = CASE WHEN expires_at < ?2 THEN 1 ELSE attempts + 1 END,
       expires_at = CASE WHEN expires_at < ?2 THEN ?2 + ?3 WHEN attempts + 1 = ?4 THEN ?2 + ?5 ELSE expires_at END
     RETURNING attempts, expires_at`
  ).bind(id, now, windowSeconds, max, lockSeconds).first();
  return { allowed: row.attempts <= max, retryAfterSeconds: Math.max(0, row.expires_at - now) };
}

export async function clearAttempts(env, id) {
  await database(env).prepare("DELETE FROM enquiry_limits WHERE id = ?").bind(id).run();
}

const dimensions = ["paths", "landingPages", "referrers", "sources", "mediums", "campaigns", "countries", "devices", "events", "eventLabels", "services"];

export async function appendAnalytics(env, record) {
  const db = database(env);
  const values = [["views", "all", record.views || 0]];
  for (const field of dimensions) {
    for (const [label, count] of Object.entries(record[field] || {})) values.push([field, label, count]);
  }
  const statements = values.filter(([, , count]) => count > 0).map(([dimension, label, count]) => db.prepare(
    "INSERT INTO visit_counts (day, dimension, label, count) VALUES (?, ?, ?, ?) ON CONFLICT(day, dimension, label) DO UPDATE SET count = count + excluded.count"
  ).bind(record.date, dimension, label, count));
  for (const visitor of record.visitors || []) statements.push(db.prepare(
    "INSERT OR IGNORE INTO visit_visitors (day, visitor) VALUES (?, ?)"
  ).bind(record.date, visitor));
  if (statements.length) await db.batch(statements);
}

export async function readAnalytics(env, dates) {
  const db = database(env);
  const records = new Map(dates.map((date) => [date, { date, views: 0, visitors: [] }]));
  const counts = await db.prepare("SELECT * FROM visit_counts WHERE day >= ? AND day <= ?").bind(dates[0], dates.at(-1)).all();
  for (const row of counts.results) {
    const record = records.get(row.day);
    if (!record) continue;
    if (row.dimension === "views") record.views += row.count;
    else if (dimensions.includes(row.dimension)) (record[row.dimension] ||= {})[row.label] = row.count;
  }
  const visitors = await db.prepare("SELECT day, visitor FROM visit_visitors WHERE day >= ? AND day <= ?").bind(dates[0], dates.at(-1)).all();
  for (const row of visitors.results) records.get(row.day)?.visitors.push(row.visitor);
  return [...records.values()];
}
