import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const { Pool } = pg;

let pool;

// Set up connection pool based on environment strings
if (process.env.NODE_ENV === "development") {
    pool = new Pool({
        connectionString: process.env.DB_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
} else {
    pool = new Pool({
        connectionString: process.env.DB_URL,
        ssl: true,
    });
}

// 1. Export it as a named export (Fixes templeModel.js)
export const query = async (text, params) => {
    try {
        const res = await pool.query(text, params);
        return res;
    } catch (error) {
        console.error("Database connection query error:", error);
        throw error;
    }
};

// 2. ALSO export it as a default export (Fixes contact.js and registration.js)
export default { query };