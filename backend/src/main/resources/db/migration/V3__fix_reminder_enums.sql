-- Fix medication_reminders table to use VARCHAR instead of enum for better JPA compatibility
-- Drop the existing table
DROP TABLE IF EXISTS medication_reminders CASCADE;

-- Recreate with VARCHAR types
CREATE TABLE medication_reminders (
    id BIGSERIAL PRIMARY KEY,
    medication_id BIGINT REFERENCES medications(id) ON DELETE CASCADE NOT NULL,
    reminder_time TIME NOT NULL,
    days_of_week INTEGER[], -- Array of days (0=Sunday, 6=Saturday)
    reminder_type VARCHAR(20) NOT NULL DEFAULT 'BOTH',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    last_sent_at TIMESTAMP,
    next_reminder_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_reminder_type CHECK (reminder_type IN ('SMS', 'EMAIL', 'BOTH')),
    CONSTRAINT check_reminder_status CHECK (status IN ('PENDING', 'SENT', 'COMPLETED', 'MISSED'))
);

-- Recreate indexes
CREATE INDEX idx_medication_reminders_medication_id ON medication_reminders(medication_id);
CREATE INDEX idx_medication_reminders_next_reminder_at ON medication_reminders(next_reminder_at);
CREATE INDEX idx_medication_reminders_status ON medication_reminders(status);

-- Recreate trigger for updated_at
CREATE TRIGGER update_medication_reminders_updated_at BEFORE UPDATE ON medication_reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

