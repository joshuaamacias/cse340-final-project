-- 1. Drop existing tables to ensure a clean slate when resetting
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS temples CASCADE;

-- 2. Create Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Temples Table (To hold your 385 temples!)
CREATE TABLE temples (
    temple_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50),
    announcement_date VARCHAR(100),
    snippet TEXT
);

-- 5. Insert Default Roles
INSERT INTO roles (role_name) VALUES 
    ('user'),   -- ID 1 (Default for new registrations)
    ('admin');  -- ID 2
