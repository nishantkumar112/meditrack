package com.meditrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicationReminderSummaryDto {
	private Long id;
	private Long medicationId;
	private String medicationName;
	private Long familyMemberId;
	private String familyMemberName;
	private LocalTime reminderTime;
	private String reminderType;
	private String status;
}
