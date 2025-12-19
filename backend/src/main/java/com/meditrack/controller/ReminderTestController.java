package com.meditrack.controller;

import com.meditrack.dto.ApiResponse;
import com.meditrack.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test/reminders")
@RequiredArgsConstructor
public class ReminderTestController {

	private final ReminderService reminderService;

	@PostMapping("/process")
	public ResponseEntity<ApiResponse<Map<String, Object>>> processReminders() {
		try {
			reminderService.processDueReminders();
			Map<String, Object> result = new HashMap<>();
			result.put("message", "Reminder processing triggered");
			result.put("timestamp", java.time.LocalDateTime.now());
			return ResponseEntity.ok(ApiResponse.success(result, "Reminders processed successfully"));
		} catch (Exception e) {
			return new ResponseEntity<>(ApiResponse.error("Failed to process reminders: " + e.getMessage(),
					HttpStatus.INTERNAL_SERVER_ERROR.value()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/status")
	public ResponseEntity<ApiResponse<Map<String, Object>>> getReminderStatus() {
		Map<String, Object> status = new HashMap<>();
		status.put("schedulerEnabled", true);
		status.put("schedulerInterval", "60 seconds (1 minute)");
		status.put("currentTime", java.time.LocalDateTime.now());
		status.put("message", "Use POST /api/test/reminders/process to manually trigger reminder processing");
		return ResponseEntity.ok(ApiResponse.success(status, "Reminder system status"));
	}
}
