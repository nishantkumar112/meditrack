package com.meditrack.service;

import com.meditrack.entity.Medication;
import com.meditrack.entity.MedicationReminder;
import com.meditrack.entity.User;
import com.meditrack.repository.MedicationReminderRepository;
import com.meditrack.util.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReminderService {

	private final MedicationReminderRepository reminderRepository;
	private final NotificationService notificationService;

	@Scheduled(fixedRate = 60000) // Run every minute
	@Transactional
	public void processDueReminders() {
 		processDueReminders(LocalDateTime.now());
	}

	@Transactional
	public void processDueReminders(LocalDateTime now) {
		List<MedicationReminder> dueReminders = reminderRepository.findDueReminders(now);

		log.info("Processing {} due reminders", dueReminders.size());

		for (MedicationReminder reminder : dueReminders) {
			try {
				processReminder(reminder);
			} catch (Exception e) {
				log.error("Error processing reminder {}: {}", reminder.getId(), e.getMessage(), e);
			}
		}
	}

	@Transactional
	public void processReminder(MedicationReminder reminder) {
		Medication medication = reminder.getMedication();
		User user = medication.getFamilyMember().getUser();

		// Check if medication is still active
		if (medication.getEndDate() != null && medication.getEndDate().isBefore(LocalDate.now())) {
			reminder.setStatus(MedicationReminder.ReminderStatus.COMPLETED);
			reminderRepository.save(reminder);
			return;
		}

		// Send notification
		notificationService.sendMedicationReminder(reminder, medication, user);

		// Update reminder status
		reminder.setStatus(MedicationReminder.ReminderStatus.SENT);
		reminder.setLastSentAt(LocalDateTime.now());
		reminder.setNextReminderAt(calculateNextReminderTime(reminder));

		reminderRepository.save(reminder);
		log.info("Reminder {} processed successfully", reminder.getId());
	}

	private LocalDateTime calculateNextReminderTime(MedicationReminder reminder) {
		LocalDate today = LocalDate.now();
		LocalTime reminderTime = reminder.getReminderTime();
		List<Integer> daysOfWeek = reminder.getDaysOfWeek();

		if (daysOfWeek == null || daysOfWeek.isEmpty()) {
			// Daily reminder
			LocalDateTime nextTime = LocalDateTime.of(today.plusDays(1), reminderTime);
			return nextTime;
		}

		// Find next matching day
		int currentDayOfWeek = today.getDayOfWeek().getValue() % 7;
		for (int i = 1; i <= 7; i++) {
			int dayToCheck = (currentDayOfWeek + i) % 7;
			if (daysOfWeek.contains(dayToCheck)) {
				LocalDate targetDate = today.plusDays(i);
				return LocalDateTime.of(targetDate, reminderTime);
			}
		}

		// Fallback: next week
		return LocalDateTime.of(today.plusDays(7), reminderTime);
	}
}
