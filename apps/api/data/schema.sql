-- only name and account for now, we can add more fields later if needed

CREATE TABLE IF NOT EXISTS inventory_elements (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    account VARCHAR(255) NOT NULL,
);