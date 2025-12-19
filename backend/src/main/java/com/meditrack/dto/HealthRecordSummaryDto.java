package com.meditrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecordSummaryDto {
	private Long id;
	private Long familyMemberId;
	private String familyMemberName;
	private String recordType;
	private String title;
	private LocalDate recordedDate;
	private String value;
	private String unit;
}
