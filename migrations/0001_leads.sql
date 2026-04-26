-- FindMeRates Leads Database
CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    loan_type TEXT,
    credit_tier TEXT,
    zip TEXT,
    email TEXT,
    phone TEXT,
    created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
