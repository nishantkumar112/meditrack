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
public class HealthRecordDto {
    private Long id;
    private Long familyMemberId;
    private String recordType;
    private String title;
    private String description;
    private String value;
    private String unit;
    private LocalDate recordedDate;
    private String doctorName;
    private String notes;
}

