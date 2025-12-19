-- SQL Scripts for Testing Medication Reminders
-- Run these queries in pgAdmin or psql to verify reminder functionality

-- 1. Check all reminders and their status
SELECT 
    mr.id,
    m.name as medication_name,
    mr.reminder_time,
    mr.days_of_week,
    mr.reminder_type,
    mr.status,
    mr.last_sent_at,
    mr.next_reminder_at,
    mr.created_at,
    CASE 
        WHEN mr.next_reminder_at IS NULL THEN 'No next reminder set'
        WHEN mr.next_reminder_at <= NOW() THEN 'DUE NOW'
        WHEN mr.next_reminder_at <= NOW() + INTERVAL '1 hour' THEN 'Due within 1 hour'
        ELSE 'Scheduled for later'
    END as reminder_status
FROM medication_reminders mr
JOIN medications m ON mr.medication_id = m.id
ORDER BY mr.created_at DESC;

-- 2. Find reminders that are due now
SELECT 
    mr.id,
    m.name as medication_name,
    mr.reminder_time,
    mr.status,
    mr.next_reminder_at,
    NOW() as current_time,
    EXTRACT(EPOCH FROM (NOW() - mr.next_reminder_at))/60 as minutes_overdue
FROM medication_reminders mr
JOIN medications m ON mr.medication_id = m.id
WHERE mr.status = 'PENDING'
  AND mr.next_reminder_at IS NOT NULL
  AND mr.next_reminder_at <= NOW()
ORDER BY mr.next_reminder_at;

-- 3. Check reminder processing statistics
SELECT 
    status,
    COUNT(*) as count,
    MAX(last_sent_at) as last_processed
FROM medication_reminders
GROUP BY status;

-- 4. Find reminders scheduled for next 24 hours
SELECT 
    mr.id,
    m.name as medication_name,
    mr.reminder_time,
    mr.next_reminder_at,
    EXTRACT(EPOCH FROM (mr.next_reminder_at - NOW()))/3600 as hours_until_due
FROM medication_reminders mr
JOIN medications m ON mr.medication_id = m.id
WHERE mr.status = 'PENDING'
  AND mr.next_reminder_at IS NOT NULL
  AND mr.next_reminder_at <= NOW() + INTERVAL '24 hours'
ORDER BY mr.next_reminder_at;

-- 5. Manually set a reminder to be due now (for testing)
-- Replace {reminder_id} with actual reminder ID
/*
UPDATE medication_reminders 
SET next_reminder_at = NOW(),
    status = 'PENDING'
WHERE id = {reminder_id};
*/

-- 6. Check reminders processed today
SELECT 
    mr.id,
    m.name as medication_name,
    mr.last_sent_at,
    mr.next_reminder_at,
    mr.status
FROM medication_reminders mr
JOIN medications m ON mr.medication_id = m.id
WHERE DATE(mr.last_sent_at) = CURRENT_DATE
ORDER BY mr.last_sent_at DESC;

-- 7. Reset a reminder for testing (set it to be due in 2 minutes)
-- Replace {reminder_id} with actual reminder ID
/*
UPDATE medication_reminders 
SET next_reminder_at = NOW() + INTERVAL '2 minutes',
    status = 'PENDING',
    last_sent_at = NULL
WHERE id = {reminder_id};
*/

-- 8. Check if scheduler is finding due reminders
-- This query matches what the scheduler uses
SELECT 
    mr.id,
    m.name as medication_name,
    mr.next_reminder_at,
    NOW() as current_time
FROM medication_reminders mr
JOIN medications m ON mr.medication_id = m.id
WHERE mr.status = 'PENDING'
  AND mr.next_reminder_at <= NOW()
  AND mr.next_reminder_at IS NOT NULL;

