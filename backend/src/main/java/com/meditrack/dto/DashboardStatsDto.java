package com.meditrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
	private Long totalMembers;
	private Long totalMedications;
	private Long totalHealthRecords;
	private Long totalReminders;
}
