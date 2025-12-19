-- Create enum types
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE reminder_status AS ENUM ('PENDING', 'SENT', 'COMPLETED', 'MISSED');
CREATE TYPE reminder_type AS ENUM ('SMS', 'EMAIL', 'BOTH');

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    enabled BOOLEAN DEFAULT true,
    mfa_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles table
CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    PRIMARY KEY (user_id, role)
);

-- Family members table
CREATE TABLE family_members (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    relationship VARCHAR(50),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health records table
CREATE TABLE health_records (
    id BIGSERIAL PRIMARY KEY,
    family_member_id BIGINT REFERENCES family_members(id) ON DELETE CASCADE NOT NULL,
    record_type VARCHAR(50) NOT NULL, -- 'CONDITION', 'VITAL', 'ALLERGY', 'PRESCRIPTION'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    value VARCHAR(100), -- For vitals like blood pressure, weight, etc.
    unit VARCHAR(20), -- For vitals unit (kg, mmHg, etc.)
    recorded_date DATE NOT NULL,
    doctor_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medications table
CREATE TABLE medications (
    id BIGSERIAL PRIMARY KEY,
    family_member_id BIGINT REFERENCES family_members(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100), -- 'DAILY', 'TWICE_DAILY', 'WEEKLY', etc.
    start_date DATE NOT NULL,
    end_date DATE,
    instructions TEXT,
    prescribed_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medication reminders table
CREATE TABLE medication_reminders (
    id BIGSERIAL PRIMARY KEY,
    medication_id BIGINT REFERENCES medications(id) ON DELETE CASCADE NOT NULL,
    reminder_time TIME NOT NULL,
    days_of_week INTEGER[], -- Array of days (0=Sunday, 6=Saturday)
    reminder_type reminder_type DEFAULT 'BOTH',
    status reminder_status DEFAULT 'PENDING',
    last_sent_at TIMESTAMP,
    next_reminder_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_family_members_user_id ON family_members(user_id);
CREATE INDEX idx_health_records_family_member_id ON health_records(family_member_id);
CREATE INDEX idx_medications_family_member_id ON medications(family_member_id);
CREATE INDEX idx_medication_reminders_medication_id ON medication_reminders(medication_id);
CREATE INDEX idx_medication_reminders_next_reminder_at ON medication_reminders(next_reminder_at);
CREATE INDEX idx_medication_reminders_status ON medication_reminders(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medication_reminders_updated_at BEFORE UPDATE ON medication_reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

