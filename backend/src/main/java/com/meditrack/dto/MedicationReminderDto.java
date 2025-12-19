package com.meditrack.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicationReminderDto {
    private Long id;
    private Long medicationId;
    private LocalTime reminderTime;
    
    @JsonDeserialize(using = DaysOfWeekDeserializer.class)
    private List<Integer> daysOfWeek;
    
    private String reminderType;
    private String status;
}

