-- Fix user_roles table to use VARCHAR instead of enum for better JPA compatibility
-- Drop the existing table
DROP TABLE IF EXISTS user_roles CASCADE;

-- Recreate with VARCHAR type
CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role),
    CONSTRAINT check_role CHECK (role IN ('USER', 'ADMIN'))
);

