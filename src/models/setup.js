// 1. Fixed the import to point to database.js
import db from './database.js';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Sets up the database by running the seed.sql file if needed.
 * Checks if the 'roles' table has data - if not, runs a full re-seed.
 */
const setupDatabase = async () => {
    let hasData = false;
    try {
        // 2. Changed 'faculty' to 'roles'
        const result = await db.query(
            "SELECT EXISTS (SELECT 1 FROM roles LIMIT 1) as has_data"
        );
        hasData = result.rows[0]?.has_data || false;
    } catch (error) {
        // If query fails (e.g., table doesn't exist yet), we need to seed
        hasData = false;
    }
    
    if (hasData) {
        console.log('Database already seeded. Skipping seed process.');
    } else {
        // No roles found - run full seed
        console.log('Seeding database with tables and default roles...');
        const seedPath = join(__dirname, 'sql', 'seed.sql');
        const seedSQL = fs.readFileSync(seedPath, 'utf8');
        await db.query(seedSQL);
        console.log('Database seeded successfully!');
    }

    // This migration is safe on every startup and preserves existing data.
    await db.query(`
        CREATE TABLE IF NOT EXISTS photos (
            photo_id SERIAL PRIMARY KEY,
            temple_id INTEGER NOT NULL REFERENCES temples(temple_id) ON DELETE CASCADE,
            account_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            image_path VARCHAR(500) NOT NULL UNIQUE,
            caption TEXT,
            is_approved BOOLEAN NOT NULL DEFAULT FALSE,
            status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
            uploaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            moderated_at TIMESTAMP
        );
        -- Existing projects may already have a basic photos table. Add the
        -- moderation fields before creating indexes that use them.
        ALTER TABLE photos ADD COLUMN IF NOT EXISTS caption VARCHAR(280);
        ALTER TABLE photos ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending';
        ALTER TABLE photos ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
        ALTER TABLE photos ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP;
        UPDATE photos SET status = 'approved' WHERE is_approved IS TRUE AND status = 'pending';
        -- The original class schema used an accounts table. This app's active
        -- authentication uses users, so photo submissions must reference it.
        ALTER TABLE photos DROP CONSTRAINT IF EXISTS fk_account;
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint
                WHERE conname = 'photos_account_id_users_fkey'
                  AND conrelid = 'photos'::regclass
            ) THEN
                ALTER TABLE photos
                ADD CONSTRAINT photos_account_id_users_fkey
                FOREIGN KEY (account_id) REFERENCES users(id) ON DELETE CASCADE;
            END IF;
        END $$;
        CREATE INDEX IF NOT EXISTS photos_temple_approved_created_idx ON photos (temple_id, status, created_at DESC);
        CREATE INDEX IF NOT EXISTS photos_status_created_idx ON photos (status, created_at DESC);
    `);
    return true;
};

/**
 * Tests the database connection by executing a simple query.
 */
const testConnection = async () => {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('Database connection successful at:', result.rows[0].current_time);
    return true;
};

export { setupDatabase, testConnection };
