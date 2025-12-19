package com.meditrack.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class CreateReminderRequest {
    @NotNull(message = "Reminder time is required")
    private LocalTime reminderTime;
    
    @NotEmpty(message = "At least one day must be selected")
    private List<String> daysOfWeek; // Accept day names as strings
    
    @NotNull(message = "Reminder type is required")
    private String reminderType;
}

