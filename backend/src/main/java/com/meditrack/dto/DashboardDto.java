package com.meditrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
	private DashboardStatsDto stats;
	private List<FamilyMemberSummaryDto> recentFamilyMembers;
	private List<MedicationReminderSummaryDto> upcomingReminders;
	private List<HealthRecordSummaryDto> recentHealthRecords;
}
