package com.meditrack.service;

import com.meditrack.dto.*;
import com.meditrack.entity.FamilyMember;
import com.meditrack.entity.HealthRecord;
import com.meditrack.entity.Medication;
import com.meditrack.entity.MedicationReminder;
import com.meditrack.repository.FamilyMemberRepository;
import com.meditrack.repository.HealthRecordRepository;
import com.meditrack.repository.MedicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

	private final FamilyMemberRepository familyMemberRepository;
	private final HealthRecordRepository healthRecordRepository;
	private final MedicationRepository medicationRepository;
	private final UserService userService;

	@Transactional(readOnly = true)
	public DashboardDto getDashboardData() {
		Long currentUserId = userService.getCurrentUser().getId();

		// Get all family members for the current user
		List<FamilyMember> familyMembers = familyMemberRepository.findByUserId(currentUserId);
		List<Long> familyMemberIds = familyMembers.stream()
				.map(FamilyMember::getId)
				.collect(Collectors.toList());

		// Get statistics
		long totalMembers = familyMembers.size();

		List<Medication> allMedications = medicationRepository.findAll().stream()
				.filter(med -> familyMemberIds.contains(med.getFamilyMember().getId()))
				.collect(Collectors.toList());
		long totalMedications = allMedications.size();

		List<HealthRecord> allHealthRecords = healthRecordRepository.findAll().stream()
				.filter(record -> familyMemberIds.contains(record.getFamilyMember().getId()))
				.collect(Collectors.toList());
		long totalHealthRecords = allHealthRecords.size();

		long totalReminders = allMedications.stream()
				.mapToLong(med -> med.getReminders().size())
				.sum();

		DashboardStatsDto stats = DashboardStatsDto.builder()
				.totalMembers(totalMembers)
				.totalMedications(totalMedications)
				.totalHealthRecords(totalHealthRecords)
				.totalReminders(totalReminders)
				.build();

		// Get recent family members (limit 5)
		List<FamilyMemberSummaryDto> recentFamilyMembers = familyMembers.stream()
				.limit(5)
				.map(this::toFamilyMemberSummary)
				.collect(Collectors.toList());

		// Get upcoming reminders (limit 5)
		List<MedicationReminderSummaryDto> upcomingReminders = allMedications.stream()
				.flatMap(med -> med.getReminders().stream()
						.filter(reminder -> reminder.getStatus() == MedicationReminder.ReminderStatus.PENDING)
						.map(reminder -> toReminderSummary(reminder, med, familyMembers)))
				.sorted(Comparator.comparing(MedicationReminderSummaryDto::getReminderTime))
				.limit(5)
				.collect(Collectors.toList());

		// Get recent health records (limit 5, sorted by date descending)
		List<HealthRecordSummaryDto> recentHealthRecords = allHealthRecords.stream()
				.sorted(Comparator.comparing(HealthRecord::getRecordedDate).reversed())
				.limit(5)
				.map(record -> toHealthRecordSummary(record, familyMembers))
				.collect(Collectors.toList());

		return DashboardDto.builder()
				.stats(stats)
				.recentFamilyMembers(recentFamilyMembers)
				.upcomingReminders(upcomingReminders)
				.recentHealthRecords(recentHealthRecords)
				.build();
	}

	private FamilyMemberSummaryDto toFamilyMemberSummary(FamilyMember member) {
		return FamilyMemberSummaryDto.builder()
				.id(member.getId())
				.firstName(member.getFirstName())
				.lastName(member.getLastName())
				.relationship(member.getRelationship())
				.build();
	}

	private MedicationReminderSummaryDto toReminderSummary(
			MedicationReminder reminder,
			Medication medication,
			List<FamilyMember> familyMembers) {
		FamilyMember member = familyMembers.stream()
				.filter(m -> m.getId().equals(medication.getFamilyMember().getId()))
				.findFirst()
				.orElse(null);

		return MedicationReminderSummaryDto.builder()
				.id(reminder.getId())
				.medicationId(medication.getId())
				.medicationName(medication.getName())
				.familyMemberId(medication.getFamilyMember().getId())
				.familyMemberName(member != null ? member.getFirstName() : "Unknown")
				.reminderTime(reminder.getReminderTime())
				.reminderType(reminder.getReminderType().name())
				.status(reminder.getStatus().name())
				.build();
	}

	private HealthRecordSummaryDto toHealthRecordSummary(
			HealthRecord record,
			List<FamilyMember> familyMembers) {
		FamilyMember member = familyMembers.stream()
				.filter(m -> m.getId().equals(record.getFamilyMember().getId()))
				.findFirst()
				.orElse(null);

		return HealthRecordSummaryDto.builder()
				.id(record.getId())
				.familyMemberId(record.getFamilyMember().getId())
				.familyMemberName(member != null
						? member.getFirstName() + " " + member.getLastName()
						: "Unknown")
				.recordType(record.getRecordType())
				.title(record.getTitle())
				.recordedDate(record.getRecordedDate())
				.value(record.getValue())
				.unit(record.getUnit())
				.build();
	}
}
